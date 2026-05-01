"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Lock, Store, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { api, type AppUser } from "@/lib/warung/api";

// ── Tab types ─────────────────────────────────────────────────────────────────
type Tab = "profile" | "security" | "store";

// ── Helpers ───────────────────────────────────────────────────────────────────
function TabButton({ active, onClick, icon: Icon, label }: {
    active: boolean; onClick: () => void;
    icon: React.ElementType; label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left
                ${active
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
        >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
        </button>
    );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ user, onUpdate }: { user: AppUser; onUpdate: (u: AppUser) => void }) {
    const [name, setName] = useState(user.name);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (name.trim().length < 2) { toast.error("Nama minimal 2 karakter"); return; }
        setSaving(true);
        try {
            const updated = await api.settings.updateProfile({ name: name.trim() });
            onUpdate(updated);
            toast.success("Profil berhasil diperbarui");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Gagal memperbarui profil");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Informasi Profil</CardTitle>
                <CardDescription>Perbarui nama tampilan akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" />
                </div>
                <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input value={user.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
                </div>
                <div className="space-y-1.5">
                    <Label>Role</Label>
                    <div>
                        <Badge variant={user.role === "owner" ? "default" : "secondary"} className="capitalize">
                            {user.role === "owner" ? "Owner" : "Kasir"}
                        </Badge>
                    </div>
                </div>
                <Separator />
                <Button onClick={handleSave} disabled={saving || name === user.name} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </CardContent>
        </Card>
    );
}

// ── Security Tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [saving, setSaving] = useState(false);

    function update(field: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        if (!form.currentPassword) { toast.error("Masukkan password saat ini"); return; }
        if (form.newPassword.length < 8) { toast.error("Password baru minimal 8 karakter"); return; }
        if (form.newPassword !== form.confirmPassword) { toast.error("Konfirmasi password tidak cocok"); return; }
        setSaving(true);
        try {
            await api.settings.updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
            toast.success("Password berhasil diperbarui");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Gagal memperbarui password");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Keamanan Akun</CardTitle>
                <CardDescription>Ubah password login Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="cur-pass">Password Saat Ini</Label>
                    <div className="relative">
                        <Input
                            id="cur-pass"
                            type={showCurrent ? "text" : "password"}
                            value={form.currentPassword}
                            onChange={(e) => update("currentPassword", e.target.value)}
                            placeholder="••••••••"
                            className="pr-10"
                        />
                        <button type="button" onClick={() => setShowCurrent((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="new-pass">Password Baru</Label>
                    <div className="relative">
                        <Input
                            id="new-pass"
                            type={showNew ? "text" : "password"}
                            value={form.newPassword}
                            onChange={(e) => update("newPassword", e.target.value)}
                            placeholder="Minimal 8 karakter"
                            className="pr-10"
                        />
                        <button type="button" onClick={() => setShowNew((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="confirm-pass">Konfirmasi Password Baru</Label>
                    <Input
                        id="confirm-pass"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => update("confirmPassword", e.target.value)}
                        placeholder="Ulangi password baru"
                    />
                    {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                        <p className="text-xs text-destructive">Password tidak cocok</p>
                    )}
                </div>
                <Separator />
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {saving ? "Menyimpan..." : "Perbarui Password"}
                </Button>
            </CardContent>
        </Card>
    );
}

// ── Store Info Tab ─────────────────────────────────────────────────────────────
function StoreTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Informasi Warung</CardTitle>
                <CardDescription>Detail sistem dan konfigurasi aplikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: "Nama Aplikasi", value: "Warung Madura" },
                        { label: "Versi", value: "1.0.0" },
                        { label: "Database", value: "PostgreSQL (Supabase)" },
                        { label: "Auth", value: "Supabase Auth" },
                    ].map(({ label, value }) => (
                        <div key={label} className="space-y-1">
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className="text-sm font-medium">{value}</p>
                        </div>
                    ))}
                </div>
                <Separator />
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">Konfigurasi Warung</p>
                    <p className="text-xs text-muted-foreground">
                        Fitur konfigurasi warung (nama toko, logo, alamat) akan tersedia di versi mendatang.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function SettingsScreen() {
    const [tab, setTab] = useState<Tab>("profile");
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const profile = await api.settings.getProfile();
            setUser(profile);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Gagal memuat profil");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const tabs: { id: Tab; label: string; icon: React.ElementType; ownerOnly?: boolean }[] = [
        { id: "profile", label: "Profil", icon: User },
        { id: "security", label: "Keamanan", icon: Lock },
        { id: "store", label: "Info Warung", icon: Store, ownerOnly: true },
    ];

    const visibleTabs = tabs.filter((t) => !t.ownerOnly || user?.role === "owner");

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
                <p className="text-muted-foreground text-sm mt-1">Kelola profil, keamanan, dan konfigurasi akun Anda</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                {/* Sidebar tabs */}
                <nav className="flex sm:flex-col gap-1 sm:w-44 shrink-0">
                    {visibleTabs.map((t) => (
                        <TabButton
                            key={t.id}
                            active={tab === t.id}
                            onClick={() => setTab(t.id)}
                            icon={t.icon}
                            label={t.label}
                        />
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground text-sm">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 opacity-50" />
                                Memuat profil…
                            </CardContent>
                        </Card>
                    ) : !user ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground text-sm">
                                Gagal memuat profil. Coba refresh halaman.
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {tab === "profile" && <ProfileTab user={user} onUpdate={setUser} />}
                            {tab === "security" && <SecurityTab />}
                            {tab === "store" && user.role === "owner" && <StoreTab />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
