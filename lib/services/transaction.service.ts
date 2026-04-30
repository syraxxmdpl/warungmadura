import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
    products,
    stockMovements,
    transactionItems,
    transactions,
} from "@/db/schema/warung";
import { user as userTable } from "@/db/schema/auth";
import { type AuthContext, HttpError } from "@/lib/api/auth-guard";
import type { z } from "zod";
import type { transactionCreateSchema } from "@/lib/api/validators";

type TransactionCreate = z.infer<typeof transactionCreateSchema>;

export interface TransactionFilters {
    from?: string;
    to?: string;
    cashierId?: string;
    limit?: number;
}

export class TransactionService {
    async list(filters: TransactionFilters, ctx: AuthContext) {
        const { from, to, cashierId, limit = 100 } = filters;
        const conditions = [];

        if (from) conditions.push(gte(transactions.createdAt, new Date(from)));
        if (to) {
            const d = new Date(to);
            d.setHours(23, 59, 59, 999);
            conditions.push(lte(transactions.createdAt, d));
        }
        if (cashierId) {
            conditions.push(eq(transactions.userId, cashierId));
        } else if (ctx.role === "cashier") {
            conditions.push(eq(transactions.userId, ctx.userId));
        }

        return db
            .select({
                id: transactions.id,
                userId: transactions.userId,
                cashierName: userTable.name,
                totalAmount: transactions.totalAmount,
                totalCost: transactions.totalCost,
                paymentMethod: transactions.paymentMethod,
                status: transactions.status,
                createdAt: transactions.createdAt,
            })
            .from(transactions)
            .leftJoin(userTable, eq(userTable.id, transactions.userId))
            .where(conditions.length ? and(...conditions) : undefined)
            .orderBy(desc(transactions.createdAt))
            .limit(Math.min(limit, 500));
    }

    async getById(id: string, ctx: AuthContext) {
        const [trx] = await db
            .select({
                id: transactions.id,
                userId: transactions.userId,
                cashierName: userTable.name,
                totalAmount: transactions.totalAmount,
                totalCost: transactions.totalCost,
                paymentMethod: transactions.paymentMethod,
                status: transactions.status,
                createdAt: transactions.createdAt,
            })
            .from(transactions)
            .leftJoin(userTable, eq(userTable.id, transactions.userId))
            .where(eq(transactions.id, id))
            .limit(1);

        if (!trx) throw new HttpError(404, "Transaksi tidak ditemukan");
        if (ctx.role === "cashier" && trx.userId !== ctx.userId) {
            throw new HttpError(403, "Tidak berhak mengakses transaksi ini");
        }

        const items = await db
            .select({
                id: transactionItems.id,
                productId: transactionItems.productId,
                productName: products.name,
                sku: products.sku,
                quantity: transactionItems.quantity,
                unitPrice: transactionItems.unitPrice,
                unitCost: transactionItems.unitCost,
                subtotal: transactionItems.subtotal,
            })
            .from(transactionItems)
            .leftJoin(products, eq(products.id, transactionItems.productId))
            .where(eq(transactionItems.transactionId, id));

        return { ...trx, items };
    }

    async create(data: TransactionCreate, ctx: AuthContext) {
        const ids = Array.from(new Set(data.items.map((i) => i.productId)));

        return db.transaction(async (tx) => {
            const prodRows = await tx
                .select()
                .from(products)
                .where(inArray(products.id, ids));
            const prodMap = new Map(prodRows.map((p) => [p.id, p]));

            for (const it of data.items) {
                const p = prodMap.get(it.productId);
                if (!p)
                    throw new HttpError(
                        404,
                        `Produk #${it.productId} tidak ditemukan`,
                    );
                if (p.currentStock < it.quantity)
                    throw new HttpError(
                        409,
                        `Stok ${p.name} tidak cukup (tersedia ${p.currentStock}, diminta ${it.quantity})`,
                    );
            }

            let totalAmount = 0;
            let totalCost = 0;
            const itemRows = data.items.map((it) => {
                const p = prodMap.get(it.productId)!;
                const unitPrice = Number(p.sellingPrice);
                const unitCost = Number(p.purchasePrice);
                const subtotal = unitPrice * it.quantity;
                totalAmount += subtotal;
                totalCost += unitCost * it.quantity;
                return {
                    productId: p.id,
                    quantity: it.quantity,
                    unitPrice: unitPrice.toFixed(2),
                    unitCost: unitCost.toFixed(2),
                    subtotal: subtotal.toFixed(2),
                };
            });

            const [trx] = await tx
                .insert(transactions)
                .values({
                    userId: ctx.userId,
                    totalAmount: totalAmount.toFixed(2),
                    totalCost: totalCost.toFixed(2),
                    paymentMethod: data.paymentMethod,
                    status: "completed",
                })
                .returning();

            await tx.insert(transactionItems).values(
                itemRows.map((r) => ({ transactionId: trx.id, ...r })),
            );

            for (const it of data.items) {
                await tx
                    .update(products)
                    .set({
                        currentStock: sql`${products.currentStock} - ${it.quantity}`,
                        updatedAt: sql`now()`,
                    })
                    .where(eq(products.id, it.productId));
                await tx.insert(stockMovements).values({
                    productId: it.productId,
                    type: "out",
                    quantity: it.quantity,
                    referenceType: "transaction",
                    referenceId: trx.id,
                    notes: data.notes ?? null,
                    userId: ctx.userId,
                });
            }

            return { ...trx, items: itemRows };
        });
    }

    async refund(id: string, ctx: AuthContext) {
        return db.transaction(async (tx) => {
            const [trx] = await tx
                .select()
                .from(transactions)
                .where(eq(transactions.id, id))
                .limit(1);
            if (!trx) throw new HttpError(404, "Transaksi tidak ditemukan");
            if (trx.status !== "completed")
                throw new HttpError(
                    409,
                    `Transaksi tidak dapat di-refund (status: ${trx.status})`,
                );

            const items = await tx
                .select()
                .from(transactionItems)
                .where(eq(transactionItems.transactionId, id));

            for (const it of items) {
                await tx
                    .update(products)
                    .set({
                        currentStock: sql`${products.currentStock} + ${it.quantity}`,
                        updatedAt: sql`now()`,
                    })
                    .where(eq(products.id, it.productId));
                await tx.insert(stockMovements).values({
                    productId: it.productId,
                    type: "in",
                    quantity: it.quantity,
                    referenceType: "refund",
                    referenceId: trx.id,
                    notes: `Refund oleh ${ctx.email}`,
                    userId: ctx.userId,
                });
            }

            const [updated] = await tx
                .update(transactions)
                .set({ status: "refunded" })
                .where(eq(transactions.id, id))
                .returning();
            return updated;
        });
    }
}

export const transactionService = new TransactionService();
