"use client";

import { useState } from "react";
import {
    ShoppingCart, Package, TruckIcon, BarChart3, Users,
    ChevronDown, ChevronUp, MessageCircle, BookOpen,
    LayoutDashboard, HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
    { q: "Bagaimana cara menambahkan produk baru?", a: "Buka menu Produk di sidebar, lalu klik tombol \"+ Tambah Produk\". Isi detail produk seperti SKU, nama, kategori, harga beli, harga jual, dan stok awal, kemudian simpan." },
    { q: "Bagaimana proses transaksi POS kasir?", a: "Buka menu POS Kasir, ketuk produk yang ingin dijual untuk menambahkannya ke keranjang. Pilih metode pembayaran, masukkan nominal diterima jika tunai, lalu tekan \"Bayar & Cetak Struk\"." },
    { q: "Apa itu Stok Masuk?", a: "Stok Masuk digunakan untuk mencatat pembelian/kulakan dari supplier. Setiap pencatatan akan otomatis menambah stok produk dan tercatat di log pergerakan stok." },
    { q: "Siapa yang bisa melihat Laporan?", a: "Hanya pengguna dengan role Pemilik (Owner) yang dapat mengakses menu Laporan dan Pengguna. Kasir hanya bisa mengakses Dashboard, POS, Produk, Stok Masuk, dan Transaksi miliknya." },
    { q: "Bagaimana cara menambahkan kasir baru?", a: "Masuk sebagai Pemilik, buka menu Pengguna, lalu klik \"+ Tambah Pengguna\". Isi nama, email, password, dan pilih role Kasir. Kasir bisa langsung login setelah dibuat." },
    { q: "Apakah data tersinkronisasi antar perangkat?", a: "Ya. Semua data disimpan di cloud (Supabase PostgreSQL) dan tersinkronisasi secara real-time. Pemilik bisa memantau dari HP sementara kasir beroperasi di tablet." },
    { q: "Bagaimana cara mencetak struk transaksi?", a: "Setelah transaksi berhasil, klik tombol \"Cetak Struk PDF\" di dialog konfirmasi. Browser akan membuka dialog cetak dengan format struk 80mm standar kasir." },
];

const guides = [
    { icon: LayoutDashboard, title: "Dashboard", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400", steps: ["Pantau penjualan hari ini secara real-time", "Lihat produk dengan stok rendah", "Analisis tren penjualan 7 hari terakhir"] },
    { icon: ShoppingCart, title: "POS Kasir", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400", steps: ["Ketuk produk untuk tambah ke keranjang", "Pilih metode bayar: Tunai / QRIS / Transfer", "Klik \"Bayar & Cetak Struk\" untuk selesaikan transaksi"] },
    { icon: Package, title: "Produk", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", steps: ["Kelola master data produk dengan SKU unik", "Atur harga beli, harga jual, dan stok minimum", "Filter berdasarkan kategori atau cari via nama/SKU"] },
    { icon: TruckIcon, title: "Stok Masuk", color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400", steps: ["Catat kulakan dari supplier", "Stok produk bertambah otomatis saat dicatat", "Riwayat kulakan tersimpan dan bisa dilihat kapan saja"] },
    { icon: BarChart3, title: "Laporan", color: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400", steps: ["Filter laporan per periode atau rentang tanggal", "Lihat breakdown per kategori dan kasir", "Export laporan untuk dokumentasi"] },
    { icon: Users, title: "Pengguna", color: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", steps: ["Tambah kasir baru dengan email dan password", "Nonaktifkan akun yang tidak digunakan", "Ubah role antara Pemilik dan Kasir"] },
];

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border rounded-lg overflow-hidden">
            <button type="button" onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium pr-4">{q}</span>
                {open ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
            </button>
            {open && <div className="px-4 pb-4"><p className="text-sm text-muted-foreground leading-relaxed">{a}</p></div>}
        </div>
    );
}

export function HelpScreen() {
    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="rounded-xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/10 border border-amber-500/20 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white grid place-items-center shrink-0">
                        <HelpCircle className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Pusat Bantuan</h1>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                    Temukan panduan penggunaan fitur, jawaban atas pertanyaan umum, dan informasi kontak di bawah ini.
                </p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-semibold">Panduan Cepat per Fitur</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {guides.map((g) => (
                        <Card key={g.title} className="h-full">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${g.color}`}>
                                        <g.icon className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-sm">{g.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-1.5">
                                    {g.steps.map((step, i) => (
                                        <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                                            <span className="shrink-0 font-semibold text-foreground">{i + 1}.</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-semibold">Pertanyaan yang Sering Diajukan</h2>
                </div>
                <div className="space-y-2">
                    {faqs.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
                </div>
            </section>

            <section>
                <div className="rounded-lg border p-5 bg-muted/30">
                    <h2 className="font-semibold text-sm mb-1">Butuh bantuan lebih lanjut?</h2>
                    <p className="text-xs text-muted-foreground">
                        Hubungi tim pengembang melalui repositori GitHub atau email di{" "}
                        <span className="font-medium text-foreground">support@warungmadura.id</span>.
                        Respons dalam 1–2 hari kerja.
                    </p>
                </div>
            </section>
        </div>
    );
}
