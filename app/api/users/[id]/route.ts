import { type NextRequest } from "next/server";
import { requireRole } from "@/lib/api/auth-guard";
import { handleError, noContent, ok } from "@/lib/api/responses";
import { userUpdateSchema } from "@/lib/api/validators";
import { userService } from "@/lib/services";

interface Params {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const ctx = await requireRole("owner");
        const { id } = await params;
        const body = userUpdateSchema.parse(await req.json());
        return ok(await userService.update(id, body, ctx));
    } catch (e) {
        return handleError(e);
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const ctx = await requireRole("owner");
        const { id } = await params;
        await userService.delete(id, ctx);
        return noContent();
    } catch (e) {
        return handleError(e);
    }
}
