import { getAuthContext } from "@/lib/api/auth-guard";
import { handleError, ok } from "@/lib/api/responses";
import { reportService } from "@/lib/services";

export async function GET() {
    try {
        await getAuthContext();
        return ok(await reportService.getDashboard());
    } catch (e) {
        return handleError(e);
    }
}
