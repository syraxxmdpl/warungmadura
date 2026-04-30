import { type NextRequest } from "next/server";
import { requireRole } from "@/lib/api/auth-guard";
import { handleError, ok } from "@/lib/api/responses";
import { uuidParamSchema } from "@/lib/api/validators";
import { transactionService } from "@/lib/services";

interface Params {
    params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: Params) {
    try {
        const ctx = await requireRole("owner");
        const { id } = uuidParamSchema.parse(await params);
        return ok(await transactionService.refund(id, ctx));
    } catch (e) {
        return handleError(e);
    }
}
