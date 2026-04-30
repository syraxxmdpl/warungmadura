import { type NextRequest } from "next/server";
import { requireRole } from "@/lib/api/auth-guard";
import { created, handleError, ok } from "@/lib/api/responses";
import { categoryCreateSchema } from "@/lib/api/validators";
import { categoryService } from "@/lib/services";

export async function GET() {
    try {
        return ok(await categoryService.list());
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireRole("owner");
        const body = categoryCreateSchema.parse(await req.json());
        return created(await categoryService.create(body));
    } catch (e) {
        return handleError(e);
    }
}
