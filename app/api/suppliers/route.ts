import { type NextRequest } from "next/server";
import { getAuthContext, requireRole } from "@/lib/api/auth-guard";
import { created, handleError, ok } from "@/lib/api/responses";
import { supplierCreateSchema } from "@/lib/api/validators";
import { supplierService } from "@/lib/services";

export async function GET() {
    try {
        await getAuthContext();
        return ok(await supplierService.list());
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireRole("owner");
        const body = supplierCreateSchema.parse(await req.json());
        return created(await supplierService.create(body));
    } catch (e) {
        return handleError(e);
    }
}
