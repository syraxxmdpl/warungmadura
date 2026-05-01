import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { SettingsScreen } from "@/components/warung/settings-screen";

export const metadata = { title: "Pengaturan — Warung Madura" };

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/sign-in?redirect=/settings");

    return (
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <SettingsScreen />
        </div>
    );
}
