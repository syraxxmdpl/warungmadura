import { type NextRequest } from "next/server";
import { getAuthContext, requireRole } from "@/lib/api/auth-guard";
import { created, handleError, ok } from "@/lib/api/responses";
import { productCreateSchema } from "@/lib/api/validators";
import { productService } from "@/lib/services";

export async function GET(req: NextRequest) {
    try {
        await getAuthContext();
        const url = new URL(req.url);
        return ok(
            await productService.list({
                search: url.searchParams.get("search")?.trim(),
                categoryId: url.searchParams.get("categoryId")
                    ? Number(url.searchParams.get("categoryId"))
                    : undefined,
                lowStock: url.searchParams.get("lowStock") === "1",
            }),
        );
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireRole("owner");
        const body = productCreateSchema.parse(await req.json());
        return created(await productService.create(body));
    } catch (e) {
        return handleError(e);
    }
}
