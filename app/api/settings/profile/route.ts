import { type NextRequest } from "next/server";
import { getAuthContext } from "@/lib/api/auth-guard";
import { ok, handleError } from "@/lib/api/responses";
import { profileUpdateSchema } from "@/lib/api/validators";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const ctx = await getAuthContext();
        const [profile] = await db
            .select({ id: userTable.id, name: userTable.name, email: userTable.email, role: userTable.role, createdAt: userTable.createdAt })
            .from(userTable)
            .where(eq(userTable.id, ctx.userId));
        return ok(profile);
    } catch (e) {
        return handleError(e);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const ctx = await getAuthContext();
        const body = profileUpdateSchema.parse(await req.json());
        const [updated] = await db
            .update(userTable)
            .set({ name: body.name, updatedAt: new Date() })
            .where(eq(userTable.id, ctx.userId))
            .returning({ id: userTable.id, name: userTable.name, email: userTable.email, role: userTable.role });
        return ok(updated);
    } catch (e) {
        return handleError(e);
    }
}
