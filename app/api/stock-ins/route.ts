import { type NextRequest } from "next/server";
import { getAuthContext } from "@/lib/api/auth-guard";
import { created, handleError, ok } from "@/lib/api/responses";
import { stockInCreateSchema } from "@/lib/api/validators";
import { stockInService } from "@/lib/services";

export async function GET(req: NextRequest) {
    try {
        await getAuthContext();
        const url = new URL(req.url);
        return ok(
            await stockInService.list(
                Number(url.searchParams.get("limit") ?? "100"),
            ),
        );
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        const ctx = await getAuthContext();
        const body = stockInCreateSchema.parse(await req.json());
        return created(await stockInService.create(body, ctx));
    } catch (e) {
        return handleError(e);
    }
}
