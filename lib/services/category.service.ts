import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema/warung";
import { HttpError } from "@/lib/api/auth-guard";
import type { z } from "zod";
import type {
    categoryCreateSchema,
    categoryUpdateSchema,
} from "@/lib/api/validators";

type CategoryCreate = z.infer<typeof categoryCreateSchema>;
type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

export class CategoryService {
    async list() {
        return db.select().from(categories).orderBy(asc(categories.name));
    }

    async getById(id: number) {
        const [row] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1);
        if (!row) throw new HttpError(404, "Kategori tidak ditemukan");
        return row;
    }

    async create(data: CategoryCreate) {
        const [row] = await db
            .insert(categories)
            .values({ name: data.name, description: data.description ?? null })
            .returning();
        return row;
    }

    async update(id: number, data: CategoryUpdate) {
        const [row] = await db
            .update(categories)
            .set(data)
            .where(eq(categories.id, id))
            .returning();
        if (!row) throw new HttpError(404, "Kategori tidak ditemukan");
        return row;
    }

    async delete(id: number) {
        const result = await db
            .delete(categories)
            .where(eq(categories.id, id))
            .returning();
        if (!result.length) throw new HttpError(404, "Kategori tidak ditemukan");
    }
}

export const categoryService = new CategoryService();
