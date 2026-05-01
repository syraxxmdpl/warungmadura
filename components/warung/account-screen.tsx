"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCircle, Mail, Shield, CalendarDays, MonitorSmartphone, LogOut, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type AccountInfo } from "@/lib/warung/api";
import { signOut } from "@/lib/auth-client";

export function AccountScreen() {
    const router = useRouter();
    const [user, setUser] = useState<AccountInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const load = useCallback(async () => {
        try {
            const data = await api.account.get();
            setUser(data);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Gagal memuat profil");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut();
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error("Gagal log out");
        } finally {
            setIsSigningOut(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-6" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Gagal memuat informasi akun.</p>
            </div>
        );
    }

    const userInitials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
        : user.email[0].toUpperCase();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Akun Saya</h1>
                <p className="text-muted-foreground text-sm mt-1">Kelola profil dan preferensi akun Anda</p>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-xl">{user.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                {user.email}
                                <Badge variant={user.role === "owner" ? "default" : "secondary"} className="capitalize text-[10px] h-5">
                                    {user.role === "owner" ? "Owner" : "Kasir"}
                                </Badge>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <UserCircle className="h-4 w-4" /> Nama Lengkap
                            </div>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Mail className="h-4 w-4" /> Email
                            </div>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Shield className="h-4 w-4" /> Status Akun
                            </div>
                            <p className="font-medium flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-destructive"}`} />
                                {user.isActive ? "Aktif" : "Nonaktif"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <CalendarDays className="h-4 w-4" /> Bergabung Sejak
                            </div>
                            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" className="gap-2" onClick={() => router.push("/settings")}>
                            <Settings className="h-4 w-4" /> Pengaturan Akun
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <MonitorSmartphone className="h-5 w-5" /> Sesi Aktif
                    </CardTitle>
                    <CardDescription>Informasi perangkat yang sedang digunakan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                        <div>
                            <p className="font-medium text-sm">Sesi Saat Ini</p>
                            <p className="text-xs text-muted-foreground mt-1">Perangkat yang sedang Anda gunakan</p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Aktif</Badge>
                    </div>
                    
                    <Button variant="destructive" className="w-full gap-2" onClick={handleSignOut} disabled={isSigningOut}>
                        <LogOut className="h-4 w-4" /> {isSigningOut ? "Keluar..." : "Log Out"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
