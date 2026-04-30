import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { suppliers } from "@/db/schema/warung";
import { HttpError } from "@/lib/api/auth-guard";
import type { z } from "zod";
import type {
    supplierCreateSchema,
    supplierUpdateSchema,
} from "@/lib/api/validators";

type SupplierCreate = z.infer<typeof supplierCreateSchema>;
type SupplierUpdate = z.infer<typeof supplierUpdateSchema>;

export class SupplierService {
    async list() {
        return db.select().from(suppliers).orderBy(asc(suppliers.name));
    }

    async getById(id: number) {
        const [row] = await db
            .select()
            .from(suppliers)
            .where(eq(suppliers.id, id))
            .limit(1);
        if (!row) throw new HttpError(404, "Supplier tidak ditemukan");
        return row;
    }

    async create(data: SupplierCreate) {
        const [row] = await db
            .insert(suppliers)
            .values({
                name: data.name,
                phone: data.phone ?? null,
                address: data.address ?? null,
            })
            .returning();
        return row;
    }

    async update(id: number, data: SupplierUpdate) {
        const [row] = await db
            .update(suppliers)
            .set({
                ...data,
                phone: data.phone === undefined ? undefined : (data.phone ?? null),
                address:
                    data.address === undefined ? undefined : (data.address ?? null),
            })
            .where(eq(suppliers.id, id))
            .returning();
        if (!row) throw new HttpError(404, "Supplier tidak ditemukan");
        return row;
    }

    async delete(id: number) {
        const result = await db
            .delete(suppliers)
            .where(eq(suppliers.id, id))
            .returning();
        if (!result.length) throw new HttpError(404, "Supplier tidak ditemukan");
    }
}

export const supplierService = new SupplierService();
