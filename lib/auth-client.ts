"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface SessionUser {
    id: string;
    email: string;
    name: string;
    image: string | null;
}

interface SessionData {
    user: SessionUser;
    session: Session;
}

function mapSession(session: Session): SessionData {
    return {
        user: {
            id: session.user.id,
            email: session.user.email!,
            name: (session.user.user_metadata?.name as string) || session.user.email!,
            image: (session.user.user_metadata?.avatar_url as string) || null,
        },
        session,
    };
}

export function useSession() {
    const [data, setData] = useState<SessionData | null | undefined>(undefined);

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getSession().then(({ data: { session } }) => {
            setData(session ? mapSession(session) : null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setData(session ? mapSession(session) : null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { data, isPending: data === undefined };
}

export async function signOut() {
    const supabase = createClient();
    return supabase.auth.signOut();
}

export const signIn = {
    email: async ({ email, password }: { email: string; password: string }) => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { data, error };
    },
};

export const signUp = {
    email: async (params: { email: string; password: string; name: string }) => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email: params.email,
            password: params.password,
            options: {
                data: { name: params.name },
            },
        });
        return { data, error };
    },
};
