import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { NotificationsScreen } from "@/components/warung/notifications-screen";

export const metadata = { title: "Notifikasi — Warung Madura" };

export default async function NotificationsPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/sign-in?redirect=/notifications");

    return (
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <NotificationsScreen />
        </div>
    );
}
