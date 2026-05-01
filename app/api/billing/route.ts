import { getAuthContext } from "@/lib/api/auth-guard";
import { ok, handleError } from "@/lib/api/responses";
import { db } from "@/db";
import { products, transactions } from "@/db/schema/warung";
import { user as userTable } from "@/db/schema/auth";
import { count, gte, and, eq } from "drizzle-orm";

export async function GET() {
    try {
        await getAuthContext();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [[productCount], [txCount], [userCount]] = await Promise.all([
            db.select({ count: count() }).from(products),
            db.select({ count: count() }).from(transactions)
                .where(gte(transactions.createdAt, startOfMonth)),
            db.select({ count: count() }).from(userTable)
                .where(eq(userTable.isActive, true)),
        ]);

        return ok({
            plan: "free",
            planLabel: "Gratis",
            stats: {
                totalProducts: productCount.count,
                transactionsThisMonth: txCount.count,
                activeUsers: userCount.count,
            },
            limits: {
                maxProducts: null,
                maxUsers: null,
                maxTransactions: null,
            },
            features: [
                { name: "POS Kasir multi-kasir", included: true },
                { name: "Manajemen produk & kategori", included: true },
                { name: "Stok masuk & tracking pergerakan stok", included: true },
                { name: "Laporan penjualan & profit", included: true },
                { name: "Cetak struk PDF", included: true },
                { name: "Multi pengguna (owner + kasir)", included: true },
                { name: "Export laporan Excel/CSV", included: true },
                { name: "Integrasi marketplace", included: false },
                { name: "Notifikasi WhatsApp otomatis", included: false },
            ],
        });
    } catch (e) {
        return handleError(e);
    }
}
