import { type NextRequest } from "next/server";
import { getAuthContext } from "@/lib/api/auth-guard";
import { handleError, ok } from "@/lib/api/responses";
import { uuidParamSchema } from "@/lib/api/validators";
import { stockInService } from "@/lib/services";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        await getAuthContext();
        const { id } = uuidParamSchema.parse(await params);
        return ok(await stockInService.getById(id));
    } catch (e) {
        return handleError(e);
    }
}
