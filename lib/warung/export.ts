import type { SalesReport } from "@/lib/warung/api";

function rupiahPlain(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDateLabel(iso: string): string {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(iso));
}

function formatDateTimeLabel(iso: string): string {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(iso));
}

// ── CSV ────────────────────────────────────────────────────────────────────

function escapeCell(value: string | number): string {
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function csvRow(cells: (string | number)[]): string {
    return cells.map(escapeCell).join(",");
}

export function exportReportCSV(report: SalesReport, periodLabel: string) {
    const { summary, categoryBreakdown, transactions, range } = report;

    const rows: string[] = [];

    rows.push(csvRow(["LAPORAN PENJUALAN"]));
    rows.push(csvRow(["Periode", periodLabel]));
    rows.push(csvRow(["Dari", formatDateLabel(range.from)]));
    rows.push(csvRow(["Sampai", formatDateLabel(range.to)]));
    rows.push("");

    rows.push(csvRow(["RINGKASAN"]));
    rows.push(csvRow(["Total Transaksi", summary.transactionCount]));
    rows.push(csvRow(["Pendapatan", rupiahPlain(summary.totalRevenue)]));
    rows.push(csvRow(["HPP", rupiahPlain(summary.totalCost)]));
    rows.push(csvRow(["Laba Kotor", rupiahPlain(summary.grossProfit)]));
    rows.push(csvRow(["Margin", `${summary.margin.toFixed(1)}%`]));
    rows.push("");

    if (categoryBreakdown.length > 0) {
        rows.push(csvRow(["BREAKDOWN PER KATEGORI"]));
        rows.push(csvRow(["Kategori", "Qty", "Pendapatan", "HPP"]));
        for (const c of categoryBreakdown) {
            rows.push(csvRow([
                c.categoryName ?? "Tanpa kategori",
                c.qty ?? 0,
                rupiahPlain(Number(c.revenue ?? 0)),
                rupiahPlain(Number(c.cost ?? 0)),
            ]));
        }
        rows.push("");
    }

    rows.push(csvRow(["DAFTAR TRANSAKSI"]));
    rows.push(csvRow(["ID Transaksi", "Tanggal", "Kasir", "Metode Bayar", "Total", "Laba"]));
    for (const t of transactions) {
        const profit = Number(t.totalAmount) - Number(t.totalCost);
        rows.push(csvRow([
            t.id,
            formatDateTimeLabel(t.createdAt),
            t.cashierName ?? "—",
            t.paymentMethod.toUpperCase(),
            rupiahPlain(Number(t.totalAmount)),
            rupiahPlain(profit),
        ]));
    }

    const bom = "﻿";
    const blob = new Blob([bom + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-penjualan-${range.from}-${range.to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ── PDF ────────────────────────────────────────────────────────────────────

export async function exportReportPDF(report: SalesReport, periodLabel: string) {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const { summary, categoryBreakdown, transactions, range } = report;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const marginX = 14;
    let y = 14;

    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Laporan Penjualan", marginX, y);
    y += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
        `Periode: ${periodLabel}   |   ${formatDateLabel(range.from)} – ${formatDateLabel(range.to)}`,
        marginX,
        y,
    );
    y += 4;
    doc.setDrawColor(200);
    doc.line(marginX, y, 196, y);
    y += 6;

    // Summary
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan", marginX, y);
    y += 2;

    autoTable(doc, {
        startY: y,
        margin: { left: marginX, right: marginX },
        head: [["Keterangan", "Nilai"]],
        body: [
            ["Total Transaksi", String(summary.transactionCount)],
            ["Pendapatan", rupiahPlain(summary.totalRevenue)],
            ["HPP", rupiahPlain(summary.totalCost)],
            ["Laba Kotor", rupiahPlain(summary.grossProfit)],
            ["Margin", `${summary.margin.toFixed(1)}%`],
        ],
        styles: { fontSize: 9 },
        headStyles: { fillColor: [245, 158, 11] },
        columnStyles: { 1: { halign: "right" } },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

    // Category breakdown
    if (categoryBreakdown.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Breakdown per Kategori", marginX, y);
        y += 2;

        autoTable(doc, {
            startY: y,
            margin: { left: marginX, right: marginX },
            head: [["Kategori", "Qty", "Pendapatan", "HPP"]],
            body: categoryBreakdown.map((c) => [
                c.categoryName ?? "Tanpa kategori",
                String(c.qty ?? 0),
                rupiahPlain(Number(c.revenue ?? 0)),
                rupiahPlain(Number(c.cost ?? 0)),
            ]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [245, 158, 11] },
            columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
        });

        y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
    }

    // Transactions
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Daftar Transaksi", marginX, y);
    y += 2;

    autoTable(doc, {
        startY: y,
        margin: { left: marginX, right: marginX },
        head: [["ID", "Tanggal", "Kasir", "Metode", "Total", "Laba"]],
        body: transactions.map((t) => {
            const profit = Number(t.totalAmount) - Number(t.totalCost);
            return [
                t.id.slice(0, 8) + "…",
                formatDateTimeLabel(t.createdAt),
                t.cashierName ?? "—",
                t.paymentMethod.toUpperCase(),
                rupiahPlain(Number(t.totalAmount)),
                rupiahPlain(profit),
            ];
        }),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [245, 158, 11] },
        columnStyles: {
            4: { halign: "right" },
            5: { halign: "right" },
        },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Halaman ${i} dari ${pageCount}   |   Dicetak: ${formatDateTimeLabel(new Date().toISOString())}`,
            marginX,
            290,
        );
    }

    doc.save(`laporan-penjualan-${range.from}-${range.to}.pdf`);
}
