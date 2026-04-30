import { type NextRequest } from "next/server";
import { requireRole } from "@/lib/api/auth-guard";
import { handleError, noContent, ok } from "@/lib/api/responses";
import { categoryUpdateSchema, idParamSchema } from "@/lib/api/validators";
import { categoryService } from "@/lib/services";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = idParamSchema.parse(await params);
        return ok(await categoryService.getById(id));
    } catch (e) {
        return handleError(e);
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        await requireRole("owner");
        const { id } = idParamSchema.parse(await params);
        const body = categoryUpdateSchema.parse(await req.json());
        return ok(await categoryService.update(id, body));
    } catch (e) {
        return handleError(e);
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        await requireRole("owner");
        const { id } = idParamSchema.parse(await params);
        await categoryService.delete(id);
        return noContent();
    } catch (e) {
        return handleError(e);
    }
}
