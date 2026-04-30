import { type NextRequest } from "next/server";
import { getAuthContext } from "@/lib/api/auth-guard";
import { created, handleError, ok } from "@/lib/api/responses";
import { transactionCreateSchema } from "@/lib/api/validators";
import { transactionService } from "@/lib/services";

export async function GET(req: NextRequest) {
    try {
        const ctx = await getAuthContext();
        const url = new URL(req.url);
        return ok(
            await transactionService.list(
                {
                    from: url.searchParams.get("from") ?? undefined,
                    to: url.searchParams.get("to") ?? undefined,
                    cashierId: url.searchParams.get("cashierId") ?? undefined,
                    limit: Number(url.searchParams.get("limit") ?? "100"),
                },
                ctx,
            ),
        );
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        const ctx = await getAuthContext();
        const body = transactionCreateSchema.parse(await req.json());
        return created(await transactionService.create(body, ctx));
    } catch (e) {
        return handleError(e);
    }
}
