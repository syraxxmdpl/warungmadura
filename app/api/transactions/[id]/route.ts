import { type NextRequest } from "next/server";
import { getAuthContext } from "@/lib/api/auth-guard";
import { handleError, ok } from "@/lib/api/responses";
import { uuidParamSchema } from "@/lib/api/validators";
import { transactionService } from "@/lib/services";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const ctx = await getAuthContext();
        const { id } = uuidParamSchema.parse(await params);
        return ok(await transactionService.getById(id, ctx));
    } catch (e) {
        return handleError(e);
    }
}
