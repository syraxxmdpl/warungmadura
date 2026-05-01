import { getAuthContext } from "@/lib/api/auth-guard";
import { ok, handleError } from "@/lib/api/responses";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const ctx = await getAuthContext();

        const [profile] = await db
            .select({
                id: userTable.id,
                name: userTable.name,
                email: userTable.email,
                role: userTable.role,
                isActive: userTable.isActive,
                createdAt: userTable.createdAt,
            })
            .from(userTable)
            .where(eq(userTable.id, ctx.userId));

        if (!profile) {
            throw new Error("Profil tidak ditemukan");
        }

        return ok({
            ...profile,
            role: profile.role as "owner" | "cashier",
        });
    } catch (e) {
        return handleError(e);
    }
}
