import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { products, stockMovements } from "@/db/schema/warung";
import { user as userTable } from "@/db/schema/auth";

export interface StockMovementFilters {
    productId?: number;
    type?: string;
    from?: string;
    to?: string;
    limit?: number;
}

export class StockMovementService {
    async list(filters: StockMovementFilters = {}) {
        const { productId, type, from, to, limit = 200 } = filters;
        const conditions = [];

        if (productId) conditions.push(eq(stockMovements.productId, productId));
        if (type) conditions.push(eq(stockMovements.type, type));
        if (from) conditions.push(gte(stockMovements.createdAt, new Date(from)));
        if (to) {
            const d = new Date(to);
            d.setHours(23, 59, 59, 999);
            conditions.push(lte(stockMovements.createdAt, d));
        }

        return db
            .select({
                id: stockMovements.id,
                productId: stockMovements.productId,
                productName: products.name,
                type: stockMovements.type,
                quantity: stockMovements.quantity,
                referenceType: stockMovements.referenceType,
                referenceId: stockMovements.referenceId,
                notes: stockMovements.notes,
                userId: stockMovements.userId,
                userName: userTable.name,
                createdAt: stockMovements.createdAt,
            })
            .from(stockMovements)
            .leftJoin(products, eq(products.id, stockMovements.productId))
            .leftJoin(userTable, eq(userTable.id, stockMovements.userId))
            .where(conditions.length ? and(...conditions) : undefined)
            .orderBy(desc(stockMovements.createdAt))
            .limit(Math.min(limit, 500));
    }
}

export const stockMovementService = new StockMovementService();
