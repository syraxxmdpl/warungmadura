import { NextRequest } from "next/server";
import { asc } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth";
import { HttpError, requireRole } from "@/lib/api/auth-guard";
import { created, handleError, ok } from "@/lib/api/responses";
import { userCreateSchema } from "@/lib/api/validators";

function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET() {
    try {
        await requireRole("owner");
        const rows = await db
            .select({
                id: userTable.id,
                name: userTable.name,
                email: userTable.email,
                role: userTable.role,
                isActive: userTable.isActive,
                createdAt: userTable.createdAt,
            })
            .from(userTable)
            .orderBy(asc(userTable.name));
        return ok(rows);
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireRole("owner");
        const body = userCreateSchema.parse(await req.json());

        const supabaseAdmin = createAdminClient();
        const { data: authData, error: authError } =
            await supabaseAdmin.auth.admin.createUser({
                email: body.email,
                password: body.password,
                user_metadata: { name: body.name },
                email_confirm: true,
            });

        if (authError) {
            if (/already registered|already exists/i.test(authError.message)) {
                throw new HttpError(409, "Email sudah digunakan");
            }
            throw new HttpError(500, authError.message);
        }

        const userId = authData.user.id;
        const [profile] = await db
            .insert(userTable)
            .values({
                id: userId,
                name: body.name,
                email: body.email,
                emailVerified: true,
                role: body.role,
                isActive: true,
            })
            .returning({
                id: userTable.id,
                name: userTable.name,
                email: userTable.email,
                role: userTable.role,
                isActive: userTable.isActive,
                createdAt: userTable.createdAt,
            });

        return created(profile);
    } catch (e) {
        if (e instanceof Error && /already exists|unique/i.test(e.message)) {
            return handleError(new HttpError(409, "Email sudah digunakan"));
        }
        return handleError(e);
    }
}
