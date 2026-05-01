"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, AlertTriangle, Info, CheckCircle, Check, BellOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type AppNotification } from "@/lib/warung/api";

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID");
}

export function NotificationsScreen() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const data = await api.notifications.list();
            setNotifications(data.notifications);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const getIcon = (type: AppNotification["type"]) => {
        switch (type) {
            case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case "success": return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            case "info": return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBgColor = (type: AppNotification["type"], read: boolean) => {
        if (read) return "bg-transparent";
        switch (type) {
            case "warning": return "bg-amber-500/5";
            case "success": return "bg-emerald-500/5";
            case "info": return "bg-blue-500/5";
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Pemberitahuan sistem dan peringatan stok
                    </p>
                </div>
                {notifications.length > 0 && unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2 shrink-0 self-start sm:self-auto">
                        <Check className="h-4 w-4" /> Tandai Semua Dibaca
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader className="px-6 py-4 border-b">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="h-5 w-5" /> 
                        Semua Notifikasi
                        {unreadCount > 0 && (
                            <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full ml-2">
                                {unreadCount} baru
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                            <BellOff className="h-12 w-12 mb-4 opacity-20" />
                            <p className="font-medium text-foreground">Tidak Ada Notifikasi</p>
                            <p className="text-sm mt-1">Anda sudah melihat semuanya!</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div 
                                key={n.id} 
                                className={`flex gap-4 p-4 sm:p-6 transition-colors ${getBgColor(n.type, n.read)} hover:bg-muted/50`}
                            >
                                <div className="shrink-0 mt-0.5">
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                                        <h4 className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-foreground/80"}`}>
                                            {n.title}
                                        </h4>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatRelativeTime(n.createdAt)}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${!n.read ? "text-muted-foreground" : "text-muted-foreground/70"}`}>
                                        {n.description}
                                    </p>
                                </div>
                                {!n.read && (
                                    <div className="shrink-0 flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
