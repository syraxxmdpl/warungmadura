import { type NextRequest } from "next/server";
import { requireRole } from "@/lib/api/auth-guard";
import { handleError, ok } from "@/lib/api/responses";
import { reportFilterSchema } from "@/lib/api/validators";
import { reportService } from "@/lib/services";

export async function GET(req: NextRequest) {
    try {
        await requireRole("owner");
        const url = new URL(req.url);
        const filters = reportFilterSchema.parse({
            period: url.searchParams.get("period") ?? undefined,
            from: url.searchParams.get("from") ?? undefined,
            to: url.searchParams.get("to") ?? undefined,
            cashierId: url.searchParams.get("cashierId") ?? undefined,
            categoryId: url.searchParams.get("categoryId") ?? undefined,
        });
        return ok(await reportService.getSales(filters));
    } catch (e) {
        return handleError(e);
    }
}
