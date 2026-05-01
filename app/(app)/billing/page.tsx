import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { BillingScreen } from "@/components/warung/billing-screen";

export const metadata = { title: "Tagihan & Paket — Warung Madura" };

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/sign-in?redirect=/billing");

    return (
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <BillingScreen />
        </div>
    );
}
