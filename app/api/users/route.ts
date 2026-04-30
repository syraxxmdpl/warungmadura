import { type NextRequest } from "next/server";
import { requireRole } from "@/lib/api/auth-guard";
import { created, handleError, ok } from "@/lib/api/responses";
import { userCreateSchema } from "@/lib/api/validators";
import { userService } from "@/lib/services";

export async function GET() {
    try {
        await requireRole("owner");
        return ok(await userService.list());
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireRole("owner");
        const body = userCreateSchema.parse(await req.json());
        return created(await userService.create(body));
    } catch (e) {
        return handleError(e);
    }
}
