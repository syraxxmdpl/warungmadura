import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { HelpScreen } from "@/components/warung/help-screen";

export const metadata = { title: "Bantuan — Warung Madura" };

export default async function HelpPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/sign-in?redirect=/help");

    return (
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <HelpScreen />
        </div>
    );
}
