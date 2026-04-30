import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth";
import { createClient } from "@/lib/supabase-server";

export type Role = "owner" | "cashier";

export interface AuthContext {
    userId: string;
    email: string;
    name: string;
    role: Role;
    isActive: boolean;
}

export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: unknown,
    ) {
        super(message);
    }
}

export async function getAuthContext(): Promise<AuthContext> {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        throw new HttpError(401, "Tidak terautentikasi");
    }

    const [profile] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, session.user.id));

    if (!profile) {
        throw new HttpError(401, "Profil pengguna tidak ditemukan");
    }
    if (!profile.isActive) {
        throw new HttpError(403, "Akun dinonaktifkan");
    }

    return {
        userId: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as Role,
        isActive: profile.isActive,
    };
}

export async function requireRole(...roles: Role[]): Promise<AuthContext> {
    const ctx = await getAuthContext();
    if (!roles.includes(ctx.role)) {
        throw new HttpError(
            403,
            `Akses ditolak. Membutuhkan role: ${roles.join(", ")}`,
        );
    }
    return ctx;
}
