import { and, asc, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import {
    categories,
    products,
    transactionItems,
    transactions,
} from "@/db/schema/warung";
import { user as userTable } from "@/db/schema/auth";
import type { z } from "zod";
import type { reportFilterSchema } from "@/lib/api/validators";

type ReportFilter = z.infer<typeof reportFilterSchema>;

function startOfDay(d: Date): Date {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
}

function resolveRange(
    period?: string,
    from?: string,
    to?: string,
): { from: Date; to: Date } {
    const now = new Date();
    if (period === "today") return { from: startOfDay(now), to: now };
    if (period === "7d")
        return {
            from: startOfDay(new Date(now.getTime() - 6 * 86_400_000)),
            to: now,
        };
    if (period === "30d")
        return {
            from: startOfDay(new Date(now.getTime() - 29 * 86_400_000)),
            to: now,
        };
    if (period === "month")
        return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };

    const f = from
        ? startOfDay(new Date(from))
        : startOfDay(new Date(now.getTime() - 6 * 86_400_000));
    const t = to ? new Date(to) : now;
    if (to) t.setHours(23, 59, 59, 999);
    return { from: f, to: t };
}

export class ReportService {
    async getDashboard() {
        const now = new Date();
        const todayStart = startOfDay(now);
        const weekStart = startOfDay(new Date(now.getTime() - 6 * 86_400_000));

        const [todayAgg] = await db
            .select({
                totalAmount: sum(transactions.totalAmount),
                totalCost: sum(transactions.totalCost),
                count: count(),
            })
            .from(transactions)
            .where(
                and(
                    eq(transactions.status, "completed"),
                    gte(transactions.createdAt, todayStart),
                    lte(transactions.createdAt, now),
                ),
            );

        const lowStock = await db
            .select({
                id: products.id,
                sku: products.sku,
                name: products.name,
                currentStock: products.currentStock,
                minStock: products.minStock,
                unit: products.unit,
            })
            .from(products)
            .where(lte(products.currentStock, products.minStock))
            .orderBy(asc(products.currentStock))
            .limit(20);

        const trend = await db
            .select({
                day: sql<string>`to_char(${transactions.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`,
                total: sum(transactions.totalAmount),
                count: count(),
            })
            .from(transactions)
            .where(
                and(
                    eq(transactions.status, "completed"),
                    gte(transactions.createdAt, weekStart),
                ),
            )
            .groupBy(
                sql`to_char(${transactions.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`,
            )
            .orderBy(
                sql`to_char(${transactions.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`,
            );

        const topProducts = await db
            .select({
                productId: transactionItems.productId,
                productName: products.name,
                sku: products.sku,
                qty: sum(transactionItems.quantity),
                revenue: sum(transactionItems.subtotal),
            })
            .from(transactionItems)
            .leftJoin(
                transactions,
                eq(transactions.id, transactionItems.transactionId),
            )
            .leftJoin(products, eq(products.id, transactionItems.productId))
            .where(
                and(
                    eq(transactions.status, "completed"),
                    gte(transactions.createdAt, weekStart),
                ),
            )
            .groupBy(transactionItems.productId, products.name, products.sku)
            .orderBy(desc(sum(transactionItems.quantity)))
            .limit(5);

        const totalAmount = Number(todayAgg.totalAmount ?? 0);
        const totalCost = Number(todayAgg.totalCost ?? 0);

        return {
            today: {
                totalSales: totalAmount,
                totalCost,
                grossProfit: totalAmount - totalCost,
                transactionCount: Number(todayAgg.count),
            },
            lowStockCount: lowStock.length,
            lowStock,
            trend,
            topProducts,
        };
    }

    async getSales(filters: ReportFilter) {
        const range = resolveRange(filters.period, filters.from, filters.to);

        const txConditions = [
            eq(transactions.status, "completed"),
            gte(transactions.createdAt, range.from),
            lte(transactions.createdAt, range.to),
        ];
        if (filters.cashierId) {
            txConditions.push(eq(transactions.userId, filters.cashierId));
        }

        const [agg] = await db
            .select({
                totalRevenue: sum(transactions.totalAmount),
                totalCost: sum(transactions.totalCost),
                count: count(),
            })
            .from(transactions)
            .where(and(...txConditions));

        const txList = await db
            .select({
                id: transactions.id,
                createdAt: transactions.createdAt,
                cashierId: transactions.userId,
                cashierName: userTable.name,
                paymentMethod: transactions.paymentMethod,
                totalAmount: transactions.totalAmount,
                totalCost: transactions.totalCost,
            })
            .from(transactions)
            .leftJoin(userTable, eq(userTable.id, transactions.userId))
            .where(and(...txConditions))
            .orderBy(desc(transactions.createdAt));

        let categoryBreakdown: Array<{
            categoryId: number | null;
            categoryName: string | null;
            qty: string | null;
            revenue: string | null;
            cost: string | null;
        }> = [];

        if (filters.categoryId === undefined) {
            categoryBreakdown = await db
                .select({
                    categoryId: products.categoryId,
                    categoryName: categories.name,
                    qty: sum(transactionItems.quantity),
                    revenue: sum(transactionItems.subtotal),
                    cost: sum(transactionItems.unitCost),
                })
                .from(transactionItems)
                .leftJoin(
                    transactions,
                    eq(transactions.id, transactionItems.transactionId),
                )
                .leftJoin(products, eq(products.id, transactionItems.productId))
                .leftJoin(categories, eq(categories.id, products.categoryId))
                .where(and(...txConditions))
                .groupBy(products.categoryId, categories.name);
        }

        const totalRevenue = Number(agg.totalRevenue ?? 0);
        const totalCost = Number(agg.totalCost ?? 0);

        return {
            range: { from: range.from, to: range.to },
            summary: {
                transactionCount: Number(agg.count),
                totalRevenue,
                totalCost,
                grossProfit: totalRevenue - totalCost,
                margin:
                    totalRevenue > 0
                        ? ((totalRevenue - totalCost) / totalRevenue) * 100
                        : 0,
            },
            categoryBreakdown,
            transactions: txList,
        };
    }
}

export const reportService = new ReportService();
