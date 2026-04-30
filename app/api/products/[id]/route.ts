import { type NextRequest } from "next/server";
import { getAuthContext, requireRole } from "@/lib/api/auth-guard";
import { handleError, noContent, ok } from "@/lib/api/responses";
import { idParamSchema, productUpdateSchema } from "@/lib/api/validators";
import { productService } from "@/lib/services";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        await getAuthContext();
        const { id } = idParamSchema.parse(await params);
        return ok(await productService.getById(id));
    } catch (e) {
        return handleError(e);
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        await requireRole("owner");
        const { id } = idParamSchema.parse(await params);
        const body = productUpdateSchema.parse(await req.json());
        return ok(await productService.update(id, body));
    } catch (e) {
        return handleError(e);
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        await requireRole("owner");
        const { id } = idParamSchema.parse(await params);
        await productService.delete(id);
        return noContent();
    } catch (e) {
        return handleError(e);
    }
}
