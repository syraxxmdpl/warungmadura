import { getAuthContext } from "@/lib/api/auth-guard";
import { ok, handleError } from "@/lib/api/responses";
import { db } from "@/db";
import { products, transactions } from "@/db/schema/warung";
import { lt, gte, count, sum } from "drizzle-orm";

export interface AppNotification {
    id: string;
    type: "warning" | "info" | "success";
    title: string;
    description: string;
    createdAt: string;
    read: boolean;
}

export async function GET() {
    try {
        const ctx = await getAuthContext();
        const notifications: AppNotification[] = [];

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // ── 1. Low stock alerts ──────────────────────────────────────────────
        const lowStockItems = await db
            .select({ id: products.id, name: products.name, currentStock: products.currentStock, minStock: products.minStock, unit: products.unit })
            .from(products)
            .where(lt(products.currentStock, products.minStock))
            .limit(10);

        for (const item of lowStockItems) {
            notifications.push({
                id: `low-stock-${item.id}`,
                type: "warning",
                title: "Stok Rendah",
                description: `${item.name} tersisa ${item.currentStock} ${item.unit} (min: ${item.minStock})`,
                createdAt: now.toISOString(),
                read: false,
            });
        }

        // ── 2. Today's sales summary (owner only) ────────────────────────────
        if (ctx.role === "owner") {
            const [[todaySummary]] = await Promise.all([
                db.select({ txCount: count(), totalAmount: sum(transactions.totalAmount) })
                    .from(transactions)
                    .where(gte(transactions.createdAt, startOfToday)),
            ]);

            if (todaySummary && todaySummary.txCount > 0) {
                const total = Number(todaySummary.totalAmount ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
                notifications.push({
                    id: `sales-today-${startOfToday.toISOString()}`,
                    type: "success",
                    title: "Ringkasan Penjualan Hari Ini",
                    description: `${todaySummary.txCount} transaksi berhasil · Total ${total}`,
                    createdAt: startOfToday.toISOString(),
                    read: false,
                });
            }
        }

        // ── 3. System welcome notification ───────────────────────────────────
        notifications.push({
            id: "system-welcome",
            type: "info",
            title: "Selamat datang di Warung Madura",
            description: "Pantau penjualan, kelola stok, dan cetak struk langsung dari aplikasi ini.",
            createdAt: new Date(2024, 0, 1).toISOString(),
            read: true,
        });

        return ok({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        });
    } catch (e) {
        return handleError(e);
    }
}
