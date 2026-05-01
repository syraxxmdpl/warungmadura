import { type NextRequest } from "next/server";
import { getAuthContext } from "@/lib/api/auth-guard";
import { ok, handleError, fail } from "@/lib/api/responses";
import { passwordUpdateSchema } from "@/lib/api/validators";
import { createClient } from "@/lib/supabase-server";

export async function PUT(req: NextRequest) {
    try {
        await getAuthContext();
        const body = passwordUpdateSchema.parse(await req.json());

        const supabase = await createClient();

        // Verify current password by re-signing in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return fail(401, "Tidak terautentikasi");

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: session.user.email!,
            password: body.currentPassword,
        });
        if (signInError) return fail(400, "Password saat ini tidak benar");

        // Update to new password
        const { error: updateError } = await supabase.auth.updateUser({
            password: body.newPassword,
        });
        if (updateError) return fail(500, "Gagal memperbarui password: " + updateError.message);

        return ok({ message: "Password berhasil diperbarui" });
    } catch (e) {
        return handleError(e);
    }
}
