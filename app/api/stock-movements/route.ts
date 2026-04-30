import { type NextRequest } from "next/server";
import { getAuthContext } from "@/lib/api/auth-guard";
import { handleError, ok } from "@/lib/api/responses";
import { stockMovementService } from "@/lib/services";

export async function GET(req: NextRequest) {
    try {
        await getAuthContext();
        const url = new URL(req.url);
        return ok(
            await stockMovementService.list({
                productId: url.searchParams.get("productId")
                    ? Number(url.searchParams.get("productId"))
                    : undefined,
                type: url.searchParams.get("type") ?? undefined,
                from: url.searchParams.get("from") ?? undefined,
                to: url.searchParams.get("to") ?? undefined,
                limit: Number(url.searchParams.get("limit") ?? "200"),
            }),
        );
    } catch (e) {
        return handleError(e);
    }
}
