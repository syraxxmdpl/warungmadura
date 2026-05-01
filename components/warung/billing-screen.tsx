"use client";

import { useEffect, useState, useCallback } from "react";
import { Package, Receipt, Users, CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type BillingInfo } from "@/lib/warung/api";

export function BillingScreen() {
    const [info, setInfo] = useState<BillingInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const data = await api.billing.get();
            setInfo(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-6" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <div className="grid md:grid-cols-3 gap-4">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!info) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Gagal memuat informasi billing.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Tagihan & Paket</h1>
                <p className="text-muted-foreground text-sm mt-1">Kelola paket langganan dan pantau penggunaan aplikasi</p>
            </div>

            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                Paket Saat Ini: {info.planLabel}
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                    Aktif
                                </Badge>
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Anda sedang menggunakan paket Gratis yang cocok untuk warung skala kecil.
                            </CardDescription>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-3xl font-bold">Rp0<span className="text-sm font-normal text-muted-foreground">/bulan</span></p>
                        </div>
                    </div>
                </CardHeader>
                <CardFooter>
                    <Button disabled className="gap-2 w-full sm:w-auto">
                        Tingkatkan Paket <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground ml-4 hidden sm:block">Fitur premium sedang dalam pengembangan</p>
                </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{info.stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            {info.limits.maxProducts ? `Dari maksimal ${info.limits.maxProducts}` : "Tidak ada batas produk"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transaksi Bulan Ini</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{info.stats.transactionsThisMonth}</div>
                        <p className="text-xs text-muted-foreground">
                            {info.limits.maxTransactions ? `Dari maksimal ${info.limits.maxTransactions}` : "Tidak ada batas transaksi"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{info.stats.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            {info.limits.maxUsers ? `Dari maksimal ${info.limits.maxUsers}` : "Termasuk owner dan kasir"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Fitur yang Tersedia</CardTitle>
                    <CardDescription>Daftar fitur untuk paket {info.planLabel}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                        {info.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                                {feature.included ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                                )}
                                <span className={`text-sm ${!feature.included && "text-muted-foreground"}`}>
                                    {feature.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
