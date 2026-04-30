import { and, asc, eq, ilike, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema/warung";
import { HttpError } from "@/lib/api/auth-guard";
import type { z } from "zod";
import type {
    productCreateSchema,
    productUpdateSchema,
} from "@/lib/api/validators";

type ProductCreate = z.infer<typeof productCreateSchema>;
type ProductUpdate = z.infer<typeof productUpdateSchema>;

export interface ProductFilters {
    search?: string;
    categoryId?: number;
    lowStock?: boolean;
}

const productSelect = {
    id: products.id,
    sku: products.sku,
    name: products.name,
    categoryId: products.categoryId,
    categoryName: categories.name,
    purchasePrice: products.purchasePrice,
    sellingPrice: products.sellingPrice,
    unit: products.unit,
    currentStock: products.currentStock,
    minStock: products.minStock,
    createdAt: products.createdAt,
    updatedAt: products.updatedAt,
};

export class ProductService {
    async list(filters: ProductFilters = {}) {
        const conditions = [];
        if (filters.search) {
            const like = `%${filters.search}%`;
            conditions.push(
                or(ilike(products.name, like), ilike(products.sku, like))!,
            );
        }
        if (filters.categoryId) {
            conditions.push(eq(products.categoryId, filters.categoryId));
        }
        if (filters.lowStock) {
            conditions.push(lte(products.currentStock, products.minStock));
        }

        return db
            .select(productSelect)
            .from(products)
            .leftJoin(categories, eq(categories.id, products.categoryId))
            .where(conditions.length ? and(...conditions) : undefined)
            .orderBy(asc(products.name));
    }

    async getById(id: number) {
        const [row] = await db
            .select(productSelect)
            .from(products)
            .leftJoin(categories, eq(categories.id, products.categoryId))
            .where(eq(products.id, id))
            .limit(1);
        if (!row) throw new HttpError(404, "Produk tidak ditemukan");
        return row;
    }

    async create(data: ProductCreate) {
        const [row] = await db
            .insert(products)
            .values({
                sku: data.sku,
                name: data.name,
                categoryId: data.categoryId ?? null,
                purchasePrice: data.purchasePrice,
                sellingPrice: data.sellingPrice,
                unit: data.unit,
                currentStock: data.currentStock,
                minStock: data.minStock,
                updatedAt: sql`now()`,
            })
            .returning();
        return row;
    }

    async update(id: number, data: ProductUpdate) {
        const [row] = await db
            .update(products)
            .set({
                ...data,
                categoryId:
                    data.categoryId === undefined
                        ? undefined
                        : (data.categoryId ?? null),
                updatedAt: sql`now()`,
            })
            .where(eq(products.id, id))
            .returning();
        if (!row) throw new HttpError(404, "Produk tidak ditemukan");
        return row;
    }

    async delete(id: number) {
        const result = await db
            .delete(products)
            .where(eq(products.id, id))
            .returning();
        if (!result.length) throw new HttpError(404, "Produk tidak ditemukan");
    }
}

export const productService = new ProductService();
