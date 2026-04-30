import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
    products,
    stockInItems,
    stockIns,
    stockMovements,
    suppliers,
} from "@/db/schema/warung";
import { user as userTable } from "@/db/schema/auth";
import { type AuthContext, HttpError } from "@/lib/api/auth-guard";
import type { z } from "zod";
import type { stockInCreateSchema } from "@/lib/api/validators";

type StockInCreate = z.infer<typeof stockInCreateSchema>;

const stockInSelect = {
    id: stockIns.id,
    userId: stockIns.userId,
    userName: userTable.name,
    supplierId: stockIns.supplierId,
    supplierName: suppliers.name,
    totalCost: stockIns.totalCost,
    receivedDate: stockIns.receivedDate,
    notes: stockIns.notes,
    createdAt: stockIns.createdAt,
};

export class StockInService {
    async list(limit = 100) {
        return db
            .select(stockInSelect)
            .from(stockIns)
            .leftJoin(userTable, eq(userTable.id, stockIns.userId))
            .leftJoin(suppliers, eq(suppliers.id, stockIns.supplierId))
            .orderBy(desc(stockIns.createdAt))
            .limit(Math.min(limit, 500));
    }

    async getById(id: string) {
        const [header] = await db
            .select(stockInSelect)
            .from(stockIns)
            .leftJoin(userTable, eq(userTable.id, stockIns.userId))
            .leftJoin(suppliers, eq(suppliers.id, stockIns.supplierId))
            .where(eq(stockIns.id, id))
            .limit(1);
        if (!header) throw new HttpError(404, "Stok masuk tidak ditemukan");

        const items = await db
            .select({
                id: stockInItems.id,
                productId: stockInItems.productId,
                productName: products.name,
                quantity: stockInItems.quantity,
                unitCost: stockInItems.unitCost,
            })
            .from(stockInItems)
            .leftJoin(products, eq(products.id, stockInItems.productId))
            .where(eq(stockInItems.stockInId, id));

        return { ...header, items };
    }

    async create(data: StockInCreate, ctx: AuthContext) {
        return db.transaction(async (tx) => {
            if (data.supplierId) {
                const [sup] = await tx
                    .select({ id: suppliers.id })
                    .from(suppliers)
                    .where(eq(suppliers.id, data.supplierId))
                    .limit(1);
                if (!sup) throw new HttpError(404, "Supplier tidak ditemukan");
            }

            let totalCost = 0;
            for (const it of data.items) {
                const [p] = await tx
                    .select({ id: products.id })
                    .from(products)
                    .where(eq(products.id, it.productId))
                    .limit(1);
                if (!p)
                    throw new HttpError(
                        404,
                        `Produk #${it.productId} tidak ditemukan`,
                    );
                totalCost += Number(it.unitCost) * it.quantity;
            }

            const [header] = await tx
                .insert(stockIns)
                .values({
                    userId: ctx.userId,
                    supplierId: data.supplierId ?? null,
                    totalCost: totalCost.toFixed(2),
                    receivedDate: data.receivedDate,
                    notes: data.notes ?? null,
                })
                .returning();

            await tx.insert(stockInItems).values(
                data.items.map((it) => ({
                    stockInId: header.id,
                    productId: it.productId,
                    quantity: it.quantity,
                    unitCost: it.unitCost,
                })),
            );

            for (const it of data.items) {
                await tx
                    .update(products)
                    .set({
                        currentStock: sql`${products.currentStock} + ${it.quantity}`,
                        purchasePrice: it.unitCost,
                        updatedAt: sql`now()`,
                    })
                    .where(eq(products.id, it.productId));
                await tx.insert(stockMovements).values({
                    productId: it.productId,
                    type: "in",
                    quantity: it.quantity,
                    referenceType: "stock_in",
                    referenceId: header.id,
                    notes: data.notes ?? null,
                    userId: ctx.userId,
                });
            }

            return header;
        });
    }
}

export const stockInService = new StockInService();
