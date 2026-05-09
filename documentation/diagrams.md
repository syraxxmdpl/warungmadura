# Diagram Teknis — Warung Madura

Dokumen ini berisi diagram teknis lengkap dari aplikasi Warung Madura.
Untuk dokumentasi utama, lihat [README.md](../README.md).

---
## Diagram Arsitektur

```mermaid
flowchart TB
    subgraph Klien["Lapisan Klien (Browser)"]
        direction LR
        LP["Halaman Utama<br/>Landing Page"]
        Auth["Halaman Masuk / Daftar"]
        Demo["Halaman Demo<br/>tanpa autentikasi"]
        subgraph AppShell["Antarmuka Aplikasi"]
            Sidebar["Sidebar Navigasi"]
            Header["Header Halaman"]
            Pages["Komponen Halaman<br/>Dashboard, POS, Produk,<br/>Stok Masuk, Transaksi,<br/>Laporan, Pengguna, Pengaturan"]
        end
        ClientAPI["Klien API<br/>lib/warung/api.ts<br/>fetch dengan cookie sesi"]
    end

    subgraph Server["Lapisan Server (Next.js 15 App Router)"]
        direction TB
        MW["Middleware<br/>middleware.ts<br/>Validasi sesi untuk rute terlindungi"]

        subgraph APIRoutes["API Route Handlers (app/api/)"]
            direction LR
            R1["products"]
            R2["transactions"]
            R3["stock-ins"]
            R4["categories"]
            R5["suppliers"]
            R6["stock-movements"]
            R7["reports"]
            R8["users"]
            R9["settings"]
            R10["notifications"]
        end

        subgraph APILayer["Utilitas API (lib/api/)"]
            direction LR
            AG["Auth Guard<br/>getAuthContext()<br/>requireRole()"]
            Val["Validator Zod<br/>Validasi request body"]
            Res["Response Helper<br/>ok / created / fail<br/>handleError"]
        end

        subgraph Services["Lapisan Layanan Bisnis (lib/services/)"]
            direction LR
            S1["ProductService"]
            S2["TransactionService"]
            S3["StockInService"]
            S4["CategoryService"]
            S5["SupplierService"]
            S6["StockMovementService"]
            S7["ReportService"]
            S8["UserService"]
        end

        subgraph ORM["Lapisan Akses Data"]
            direction LR
            Drizzle["Drizzle ORM<br/>db/index.ts<br/>node-postgres"]
            Schema["Skema Database<br/>db/schema/warung.ts<br/>db/schema/auth.ts"]
        end
    end

    subgraph Eksternal["Layanan Eksternal"]
        direction LR
        SBAuth["Supabase Auth<br/>Autentikasi email/password<br/>Manajemen sesi"]
        SBDB["Supabase PostgreSQL<br/>Database cloud<br/>9 tabel relasional"]
    end

    %% Alur Klien ke Server
    Pages --> ClientAPI
    ClientAPI -->|"HTTP Request<br/>dengan cookie"| MW
    Auth -->|"Autentikasi"| SBAuth
    LP --> Auth
    LP --> Demo

    %% Alur Server
    MW -->|"Sesi valid"| APIRoutes
    MW -->|"Tanpa sesi"| Auth

    APIRoutes --> AG
    APIRoutes --> Val
    APIRoutes --> Res
    AG -->|"Verifikasi sesi"| SBAuth
    AG -->|"Query profil pengguna"| Drizzle

    APIRoutes --> Services
    Services --> Drizzle
    Drizzle --> Schema
    Schema -->|"Query SQL"| SBDB
    SBAuth -->|"Simpan data auth"| SBDB

    %% Alur Demo (bypass middleware)
    Demo -.->|"Data contoh lokal<br/>tanpa API"| Pages

    %% Styling
    classDef clientLayer fill:#3b82f6,stroke:#2563eb,color:#fff
    classDef serverLayer fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef serviceLayer fill:#f59e0b,stroke:#d97706,color:#000
    classDef dataLayer fill:#10b981,stroke:#059669,color:#fff
    classDef externalLayer fill:#ef4444,stroke:#dc2626,color:#fff

    class LP,Auth,Demo,Sidebar,Header,Pages,ClientAPI clientLayer
    class MW,R1,R2,R3,R4,R5,R6,R7,R8,R9,R10,AG,Val,Res serverLayer
    class S1,S2,S3,S4,S5,S6,S7,S8 serviceLayer
    class Drizzle,Schema dataLayer
    class SBAuth,SBDB externalLayer
```

### Penjelasan Lapisan

| Lapisan | Teknologi | Deskripsi |
|---------|-----------|-----------|
| **Klien** | React, shadcn/ui, Recharts, Tailwind CSS | Komponen antarmuka dengan navigasi sidebar, tema gelap/terang, dan klien API terpusat |
| **Middleware** | Next.js Middleware, Supabase SSR | Memvalidasi cookie sesi pada setiap request ke rute terlindungi, redirect ke halaman masuk jika tidak valid |
| **API Routes** | Next.js App Router (Route Handlers) | 10 grup endpoint RESTful yang menangani request HTTP, validasi input dengan Zod, dan proteksi peran |
| **Layanan Bisnis** | TypeScript Service Classes | 8 kelas layanan yang mengenkapsulasi logika bisnis: transaksi database, validasi stok, kalkulasi keuangan |
| **Akses Data** | Drizzle ORM, node-postgres | Query builder type-safe dengan skema deklaratif, koneksi ke PostgreSQL melalui connection string |
| **Eksternal** | Supabase Auth, Supabase PostgreSQL | Autentikasi email/password terkelola dan database PostgreSQL cloud dengan 9 tabel relasional |

## Diagram Arsitektur Sistem

```mermaid
flowchart TB
    subgraph Pengguna["Perangkat Pengguna"]
        direction LR
        HP["Smartphone\nBrowser Mobile"]
        Tablet["Tablet\nBrowser Tablet"]
        Laptop["Laptop / PC\nBrowser Desktop"]
    end

    subgraph CDN["Jaringan Pengiriman"]
        Vercel["Vercel Edge Network\nSSL/TLS Otomatis\nCDN Global"]
    end

    subgraph AppServer["Server Aplikasi"]
        direction TB

        subgraph NextJS["Next.js 15 (Node.js 18)"]
            direction TB
            SSR["Server-Side Rendering\nApp Router"]
            APIHandler["API Route Handlers\n10 grup endpoint"]
            MWLayer["Middleware\nProteksi rute + validasi sesi"]
            Static["Aset Statis\nCSS, JS, Gambar"]
        end

        subgraph Env["Variabel Lingkungan"]
            direction LR
            E1["DATABASE_URL"]
            E2["NEXT_PUBLIC_SUPABASE_URL"]
            E3["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
            E4["SUPABASE_SERVICE_ROLE_KEY"]
            E5["NEXT_PUBLIC_SITE_URL"]
        end
    end

    subgraph Supabase["Platform Supabase (Cloud)"]
        direction TB

        subgraph AuthService["Layanan Autentikasi"]
            GoTrue["GoTrue Server\nEmail/Password Auth\nJWT Token"]
        end

        subgraph DBService["Layanan Database"]
            Pooler["Connection Pooler\nPgBouncer\nPort 6543"]
            PG["PostgreSQL 15\n9 Tabel Relasional\nRLS Policies"]
        end

        subgraph Storage["Layanan Penyimpanan"]
            Bucket["Storage Bucket\nGambar Produk"]
        end

        Dashboard["Supabase Dashboard\nMonitoring + SQL Editor"]
    end

    subgraph Docker["Opsi Deploy: Docker (Self-Hosted)"]
        direction LR
        AppContainer["Container Aplikasi\nNode.js 18 Alpine\nPort 3000"]
        PGContainer["Container PostgreSQL\nPostgreSQL 16 Alpine\nPort 5432"]
        Volume["Volume Data\npostgres_data"]
    end

    %% Koneksi Pengguna
    HP -->|"HTTPS"| Vercel
    Tablet -->|"HTTPS"| Vercel
    Laptop -->|"HTTPS"| Vercel

    %% Vercel ke App
    Vercel -->|"Request routing"| NextJS

    %% App ke Supabase
    MWLayer -->|"HTTPS\nValidasi cookie sesi"| GoTrue
    APIHandler -->|"HTTPS\nService Role Key"| GoTrue
    APIHandler -->|"PostgreSQL\nConnection String"| Pooler
    SSR -->|"HTTPS\nAnon Key"| GoTrue
    Pooler -->|"Internal"| PG

    %% Env ke App
    Env -.->|"Konfigurasi"| NextJS

    %% Docker alternatif
    AppContainer -->|"TCP :5432"| PGContainer
    PGContainer --> Volume

    %% Styling
    classDef deviceNode fill:#64748b,stroke:#475569,color:#fff
    classDef cdnNode fill:#000000,stroke:#333333,color:#fff
    classDef appNode fill:#3b82f6,stroke:#2563eb,color:#fff
    classDef envNode fill:#94a3b8,stroke:#64748b,color:#0f172a
    classDef authNode fill:#f59e0b,stroke:#d97706,color:#000
    classDef dbNode fill:#10b981,stroke:#059669,color:#fff
    classDef storageNode fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef dockerNode fill:#0ea5e9,stroke:#0284c7,color:#fff

    class HP,Tablet,Laptop deviceNode
    class Vercel cdnNode
    class SSR,APIHandler,MWLayer,Static appNode
    class E1,E2,E3,E4,E5 envNode
    class GoTrue authNode
    class Pooler,PG dbNode
    class Bucket storageNode
    class Dashboard storageNode
    class AppContainer,PGContainer,Volume dockerNode
```

### Komponen Infrastruktur

| Komponen | Teknologi | Peran |
|----------|-----------|-------|
| **Perangkat Klien** | Browser (Chrome, Safari, Firefox) | Mengakses aplikasi melalui HTTPS dari berbagai perangkat |
| **CDN / Edge** | Vercel Edge Network | Distribusi global, SSL otomatis, caching aset statis, serverless functions |
| **Server Aplikasi** | Next.js 15 pada Node.js 18 | SSR, API routes, middleware autentikasi, serving aset statis |
| **Autentikasi** | Supabase GoTrue | Manajemen pengguna, JWT token, email/password auth, session cookies |
| **Connection Pooler** | Supabase PgBouncer (port 6543) | Mengelola koneksi database, connection pooling untuk performa |
| **Database** | PostgreSQL 15 (Supabase) | Penyimpanan data utama: 9 tabel relasional dengan foreign keys |
| **Docker (Opsional)** | Docker Compose, Node 18 Alpine, PostgreSQL 16 Alpine | Deployment self-hosted dengan 2 container + persistent volume |

### Opsi Deployment

```mermaid
flowchart LR
    subgraph Cloud["Vercel + Supabase (Rekomendasi)"]
        direction TB
        V1["Push ke GitHub"]
        V2["Vercel auto-deploy"]
        V3["Supabase mengelola DB + Auth"]
        V1 --> V2 --> V3
    end

    subgraph SelfHosted["Docker Self-Hosted"]
        direction TB
        D1["docker build -t warung-madura ."]
        D2["docker-compose up"]
        D3["PostgreSQL lokal + konfigurasi .env"]
        D1 --> D2 --> D3
    end

    style V1 fill:#000000,stroke:#333,color:#fff
    style V2 fill:#000000,stroke:#333,color:#fff
    style V3 fill:#10b981,stroke:#059669,color:#fff
    style D1 fill:#0ea5e9,stroke:#0284c7,color:#fff
    style D2 fill:#0ea5e9,stroke:#0284c7,color:#fff
    style D3 fill:#10b981,stroke:#059669,color:#fff
```

## Peta Situs

```mermaid
flowchart TD
    Root["/ <br/> Warung Madura"]

    subgraph Publik["Halaman Publik"]
        direction LR
        Home["/ <br/> Halaman Utama"]
        SignIn["/sign-in <br/> Halaman Masuk"]
        SignUp["/sign-up <br/> Halaman Daftar"]
        AuthCB["/auth/callback <br/> Callback Autentikasi"]
    end

    subgraph DemoPages["Halaman Demo (Tanpa Login)"]
        direction LR
        DemoDash["/demo/dashboard <br/> Demo Dashboard"]
        DemoPOS["/demo/pos <br/> Demo POS Kasir"]
    end

    subgraph App["Halaman Aplikasi (Perlu Login)"]
        direction TB

        subgraph Semua["Pemilik dan Kasir"]
            direction LR
            Dash["/dashboard <br/> Dashboard"]
            POS["/pos <br/> POS Kasir"]
            StockIn["/stock-in <br/> Stok Masuk"]
            Trx["/transactions <br/> Riwayat Transaksi"]
            Settings["/settings <br/> Pengaturan"]
            Account["/account <br/> Akun Saya"]
            Billing["/billing <br/> Tagihan"]
            Notif["/notifications <br/> Notifikasi"]
            Help["/help <br/> Bantuan"]
        end

        subgraph KhususPemilik["Khusus Pemilik"]
            direction LR
            Products["/products <br/> Manajemen Produk"]
            Reports["/reports <br/> Laporan Keuangan"]
            Users["/users <br/> Manajemen Pengguna"]
        end
    end

    subgraph APIRoutes["Endpoint API (/api)"]
        direction TB

        subgraph APIAuth["Autentikasi"]
            A1["/api/auth <br/> Login, Logout, Sesi"]
        end

        subgraph APIData["Data Bisnis"]
            direction LR
            A2["/api/products <br/> CRUD Produk"]
            A3["/api/categories <br/> CRUD Kategori"]
            A4["/api/suppliers <br/> CRUD Supplier"]
            A5["/api/transactions <br/> Transaksi + Refund"]
            A6["/api/stock-ins <br/> Stok Masuk"]
            A7["/api/stock-movements <br/> Log Pergerakan Stok"]
        end

        subgraph APIReport["Pelaporan"]
            direction LR
            A8["/api/reports/dashboard <br/> Data Dashboard"]
            A9["/api/reports/sales <br/> Laporan Penjualan"]
        end

        subgraph APISetting["Pengaturan dan Akun"]
            direction LR
            A10["/api/settings/profile <br/> Profil Pengguna"]
            A11["/api/settings/password <br/> Ubah Password"]
            A12["/api/users <br/> Manajemen Pengguna"]
            A13["/api/account <br/> Info Akun"]
            A14["/api/billing <br/> Info Tagihan"]
            A15["/api/notifications <br/> Notifikasi"]
        end

        subgraph APIDemo["Demo"]
            A16["/api/demo <br/> Data Contoh"]
        end
    end

    Root --> Publik
    Root --> DemoPages
    Root --> App
    Root --> APIRoutes

    %% Styling
    classDef publicNode fill:#10b981,stroke:#059669,color:#fff
    classDef demoNode fill:#14b8a6,stroke:#0d9488,color:#fff
    classDef sharedNode fill:#3b82f6,stroke:#2563eb,color:#fff
    classDef ownerNode fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef apiNode fill:#f59e0b,stroke:#d97706,color:#000
    classDef rootNode fill:#1e293b,stroke:#0f172a,color:#fff

    class Root rootNode
    class Home,SignIn,SignUp,AuthCB publicNode
    class DemoDash,DemoPOS demoNode
    class Dash,POS,StockIn,Trx,Settings,Account,Billing,Notif,Help sharedNode
    class Products,Reports,Users ownerNode
    class A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,A14,A15,A16 apiNode
```

### Keterangan Warna

| Warna | Akses |
|-------|-------|
| Hijau | Halaman publik â€” dapat diakses tanpa login |
| Teal | Halaman demo â€” data contoh tanpa autentikasi |
| Biru | Halaman aplikasi â€” pemilik dan kasir |
| Ungu | Halaman khusus pemilik â€” produk, laporan, pengguna |
| Kuning | Endpoint API â€” diakses oleh klien melalui HTTP |

## Wireframe Antarmuka

### Tata Letak Utama Aplikasi

```mermaid
block-beta
    columns 5

    block:sidebar:1
        columns 1
        logo["Warung Madura"]
        space
        nav1["Dashboard"]
        nav2["POS Kasir"]
        nav3["Produk"]
        nav4["Stok Masuk"]
        nav5["Transaksi"]
        nav6["Laporan"]
        nav7["Pengguna"]
        space
        nav8["Pengaturan"]
        nav9["Bantuan"]
        space
        user["Profil Pengguna"]
    end

    block:main:4
        columns 4
        header["Header - Judul Halaman | Pencarian | Tema Gelap/Terang"]:4
        space:4
        content["Area Konten Halaman"]:4
    end

    style sidebar fill:#1e293b,stroke:#334155,color:#fff
    style header fill:#f8fafc,stroke:#e2e8f0,color:#0f172a
    style content fill:#ffffff,stroke:#e2e8f0,color:#64748b
    style logo fill:#f59e0b,stroke:#d97706,color:#fff
    style nav1 fill:#3b82f6,stroke:#2563eb,color:#fff
    style nav2 fill:#3b82f6,stroke:#2563eb,color:#fff
    style nav3 fill:#3b82f6,stroke:#2563eb,color:#fff
    style nav4 fill:#3b82f6,stroke:#2563eb,color:#fff
    style nav5 fill:#3b82f6,stroke:#2563eb,color:#fff
    style nav6 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style nav7 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style nav8 fill:#64748b,stroke:#475569,color:#fff
    style nav9 fill:#64748b,stroke:#475569,color:#fff
    style user fill:#334155,stroke:#475569,color:#cbd5e1
```

### Wireframe Dashboard

```mermaid
block-beta
    columns 4

    kpi1["Penjualan Hari Ini\nRp 1.245.000"]:1
    kpi2["Jumlah Transaksi\n37"]:1
    kpi3["Laba Kotor\nRp 312.500"]:1
    kpi4["Stok Rendah\n4 produk"]:1

    chart["Grafik Tren Penjualan 7 Hari\n(Recharts Line Chart)"]:3
    lowstock["Panel Stok Rendah\n- Teh Pucuk: 2 pcs\n- Oreo: 3 pcs\n- Minyak Goreng: 1 pcs\n- Sprite: 4 pcs"]:1

    trxlive["Transaksi Terbaru\n- #a1b2c3 Rp 45.000 Tunai\n- #d4e5f6 Rp 23.500 QRIS\n- #g7h8i9 Rp 67.000 Transfer"]:2
    topprods["Produk Terlaris\n1. Indomie Goreng - 42 pcs\n2. Aqua 600ml - 38 pcs\n3. Teh Pucuk - 29 pcs\n4. Gudang Garam - 25 pcs\n5. Mie Sedaap - 21 pcs"]:2

    style kpi1 fill:#10b981,stroke:#059669,color:#fff
    style kpi2 fill:#3b82f6,stroke:#2563eb,color:#fff
    style kpi3 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style kpi4 fill:#f59e0b,stroke:#d97706,color:#000
    style chart fill:#f0f9ff,stroke:#bae6fd,color:#0c4a6e
    style lowstock fill:#fef3c7,stroke:#fcd34d,color:#92400e
    style trxlive fill:#f0fdf4,stroke:#bbf7d0,color:#14532d
    style topprods fill:#faf5ff,stroke:#e9d5ff,color:#581c87
```

### Wireframe POS Kasir

```mermaid
block-beta
    columns 3

    block:prodpanel:2
        columns 1
        prodheader["Pilih Produk | Pencarian SKU/Nama"]
        cattabs["Tab Kategori: Semua | Makanan | Minuman | Rokok | Sembako"]
        block:grid
            columns 4
            p1["Indomie Goreng\nRp 3.500\nStok: 120 pcs"]
            p2["Aqua 600ml\nRp 4.000\nStok: 85 pcs"]
            p3["Gudang Garam\nRp 28.000\nStok: 45 pcs"]
            p4["Teh Pucuk\nRp 4.500\nStok: 2 pcs"]
            p5["Mie Sedaap\nRp 3.200\nStok: 90 pcs"]
            p6["Oreo\nRp 12.000\nStok: 3 pcs"]
            p7["Sprite 390ml\nRp 5.000\nStok: 4 pcs"]
            p8["Minyak 1L\nRp 18.000\nStok: 1 pcs"]
        end
    end

    block:cartpanel:1
        columns 1
        carttitle["Keranjang (3 item)"]
        item1["Indomie Goreng x2 = Rp 7.000\n[-] 2 [+] [Hapus]"]
        item2["Aqua 600ml x1 = Rp 4.000\n[-] 1 [+] [Hapus]"]
        item3["Gudang Garam x1 = Rp 28.000\n[-] 1 [+] [Hapus]"]
        separator["---"]
        subtotal["Subtotal: Rp 39.000\nTotal: Rp 39.000"]
        payment["Metode: [Tunai] [QRIS] [Transfer]"]
        cashfield["Uang Diterima: Rp 50.000\nKembalian: Rp 11.000"]
        paybtn["Bayar dan Cetak Struk"]
    end

    style prodheader fill:#f8fafc,stroke:#e2e8f0,color:#0f172a
    style cattabs fill:#f1f5f9,stroke:#cbd5e1,color:#334155
    style p1 fill:#ffffff,stroke:#e2e8f0,color:#1e293b
    style p2 fill:#ffffff,stroke:#e2e8f0,color:#1e293b
    style p3 fill:#ffffff,stroke:#e2e8f0,color:#1e293b
    style p4 fill:#fef2f2,stroke:#fca5a5,color:#991b1b
    style p5 fill:#ffffff,stroke:#e2e8f0,color:#1e293b
    style p6 fill:#fef2f2,stroke:#fca5a5,color:#991b1b
    style p7 fill:#fef2f2,stroke:#fca5a5,color:#991b1b
    style p8 fill:#fef2f2,stroke:#fca5a5,color:#991b1b
    style carttitle fill:#1e293b,stroke:#334155,color:#fff
    style paybtn fill:#3b82f6,stroke:#2563eb,color:#fff
    style subtotal fill:#f0fdf4,stroke:#bbf7d0,color:#14532d
    style payment fill:#faf5ff,stroke:#e9d5ff,color:#581c87
```

### Wireframe Manajemen Produk

```mermaid
block-beta
    columns 4

    title["Katalog Produk - N produk terdaftar"]:3
    addbtn["+ Tambah Produk"]:1

    search["Pencarian nama / SKU"]:2
    catfilter["Filter: Semua Kategori"]:2

    block:table:4
        columns 6
        h1["Produk"]
        h2["Kategori"]
        h3["Harga Beli"]
        h4["Harga Jual"]
        h5["Stok"]
        h6["Aksi"]
        d1["Indomie Goreng\nSKU-001"]
        d2["Makanan"]
        d3["Rp 2.800"]
        d4["Rp 3.500"]
        d5["120 pcs"]
        d6["Edit | Hapus"]
        e1["Aqua 600ml\nSKU-002"]
        e2["Minuman"]
        e3["Rp 2.500"]
        e4["Rp 4.000"]
        e5["85 pcs"]
        e6["Edit | Hapus"]
        f1["Teh Pucuk\nSKU-003"]
        f2["Minuman"]
        f3["Rp 3.000"]
        f4["Rp 4.500"]
        f5["2 pcs"]
        f6["Edit | Hapus"]
    end

    style title fill:#f8fafc,stroke:#e2e8f0,color:#0f172a
    style addbtn fill:#3b82f6,stroke:#2563eb,color:#fff
    style search fill:#ffffff,stroke:#e2e8f0,color:#64748b
    style catfilter fill:#ffffff,stroke:#e2e8f0,color:#64748b
    style h1 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style h2 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style h3 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style h4 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style h5 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style h6 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style f5 fill:#fef2f2,stroke:#fca5a5,color:#991b1b
```

### Wireframe Laporan Keuangan

```mermaid
block-beta
    columns 5

    block:filterbar:5
        columns 5
        period["Periode:\n7 Hari"]
        datefrom["Dari:\n2026-05-02"]
        dateto["Sampai:\n2026-05-09"]
        cashierfilter["Kasir:\nSemua"]
        block:actions
            columns 1
            refresh["Perbarui"]
            exports["Export CSV | PDF"]
        end
    end

    rk1["Transaksi\n37"]:1
    rk2["Pendapatan\nRp 1.245.000"]:1
    rk3["HPP\nRp 932.500"]:1
    rk4["Laba Kotor\nRp 312.500"]:1
    rk5["Margin\n25.1%"]:1

    block:cattable:5
        columns 4
        ch1["Kategori"]
        ch2["Qty"]
        ch3["Pendapatan"]
        ch4["HPP"]
        cd1["Makanan Ringan"]
        cd2["120"]
        cd3["Rp 450.000"]
        cd4["Rp 336.000"]
        cd5["Minuman"]
        cd6["95"]
        cd7["Rp 380.000"]
        cd8["Rp 285.000"]
    end

    block:trxtable:5
        columns 6
        th1["ID"]
        th2["Tanggal"]
        th3["Kasir"]
        th4["Metode"]
        th5["Total"]
        th6["Laba"]
        td1["#a1b2c3"]
        td2["09 Mei 2026"]
        td3["Ahmad"]
        td4["TUNAI"]
        td5["Rp 45.000"]
        td6["Rp 11.250"]
    end

    style period fill:#ffffff,stroke:#e2e8f0,color:#334155
    style refresh fill:#64748b,stroke:#475569,color:#fff
    style exports fill:#f59e0b,stroke:#d97706,color:#000
    style rk1 fill:#3b82f6,stroke:#2563eb,color:#fff
    style rk2 fill:#10b981,stroke:#059669,color:#fff
    style rk3 fill:#ef4444,stroke:#dc2626,color:#fff
    style rk4 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style rk5 fill:#f59e0b,stroke:#d97706,color:#000
    style ch1 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style ch2 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style ch3 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style ch4 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style th1 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style th2 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style th3 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style th4 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style th5 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
    style th6 fill:#f1f5f9,stroke:#e2e8f0,color:#334155
```

## Alur Pengguna

```mermaid
flowchart TD
    Start(["Pengguna mengunjungi situs"]) --> Landing["Halaman Utama<br/>/"]

    Landing --> SignIn["Masuk<br/>/sign-in"]
    Landing --> SignUp["Daftar<br/>/sign-up"]
    Landing --> Demo["Mode Demo"]

    %% Alur Autentikasi
    SignIn -->|"Email dan Password"| AuthCheck{"Supabase Auth<br/>Sesi Valid?"}
    SignUp -->|"Buat Akun"| AuthCheck

    AuthCheck -->|"Gagal"| SignIn
    AuthCheck -->|"Berhasil"| Middleware{"Middleware<br/>Proteksi Rute"}

    %% Pemeriksaan Middleware
    Middleware -->|"Sesi Valid"| RoleCheck{"Pemeriksaan Peran"}
    Middleware -->|"Tidak Ada Sesi"| RedirectSignIn["Dialihkan ke<br/>Halaman Masuk"]
    RedirectSignIn --> SignIn

    %% Akses berdasarkan peran
    RoleCheck -->|"Pemilik"| OwnerDash["Dashboard<br/>KPI lengkap, tren, peringatan"]
    RoleCheck -->|"Kasir"| CashierDash["Dashboard<br/>Tampilan terbatas"]

    %% Navigasi Pemilik
    OwnerDash --> POS["POS Kasir<br/>/pos"]
    OwnerDash --> Products["Produk<br/>/products"]
    OwnerDash --> StockIn["Stok Masuk<br/>/stock-in"]
    OwnerDash --> Transactions["Transaksi<br/>/transactions"]
    OwnerDash --> Reports["Laporan<br/>/reports - khusus pemilik"]
    OwnerDash --> Users["Pengguna<br/>/users - khusus pemilik"]
    OwnerDash --> Settings["Pengaturan<br/>/settings"]

    %% Navigasi Kasir - terbatas
    CashierDash --> POS
    CashierDash --> StockIn
    CashierDash --> Transactions
    CashierDash --> Settings

    %% Sub-alur POS
    POS -->|"Tambah item ke keranjang"| ProcessSale["Proses Penjualan<br/>Tunai / QRIS / Transfer"]
    ProcessSale -->|"Stok berkurang otomatis"| Transactions

    %% Sub-alur Stok Masuk
    StockIn -->|"Catat dari supplier"| StockUpdate["Stok Diperbarui<br/>dicatat di log pergerakan"]

    %% Sub-alur Produk - khusus pemilik
    Products -->|"Kelola data produk"| ProductMgmt["Kelola SKU, Harga,<br/>Kategori, Stok Minimum"]

    %% Sub-alur Laporan - khusus pemilik
    Reports --> ExportReport["Ekspor<br/>CSV / PDF"]

    %% Sub-alur Manajemen Pengguna - khusus pemilik
    Users --> ManageUsers["Tambah/Edit Pengguna<br/>Tetapkan peran pemilik/kasir"]

    %% Alur Demo - tanpa autentikasi
    Demo --> DemoDash["Demo Dashboard<br/>/demo/dashboard"]
    Demo --> DemoPOS["Demo POS<br/>/demo/pos"]

    %% Keluar
    Settings --> Logout["Keluar"]
    Logout --> Landing

    %% Styling
    classDef authNode fill:#fbbf24,stroke:#d97706,color:#000
    classDef ownerNode fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef sharedNode fill:#3b82f6,stroke:#2563eb,color:#fff
    classDef demoNode fill:#10b981,stroke:#059669,color:#fff
    classDef dangerNode fill:#ef4444,stroke:#dc2626,color:#fff

    class SignIn,SignUp,AuthCheck authNode
    class Reports,Users,ManageUsers,ExportReport,ProductMgmt ownerNode
    class POS,StockIn,Transactions,ProcessSale,StockUpdate,Settings sharedNode
    class Demo,DemoDash,DemoPOS demoNode
    class RedirectSignIn dangerNode
```

### Ringkasan Alur

| Alur | Deskripsi |
|------|-----------|
| **Daftar ke Dashboard** | Pengguna baru mendaftar, Supabase membuat sesi, middleware memvalidasi, diarahkan ke `/dashboard` |
| **Masuk ke Dashboard** | Pengguna login, cookie sesi diatur, middleware melewatkan, dashboard sesuai peran |
| **Alur Pemilik** | Akses penuh: Dashboard, POS, Produk (CRUD), Stok Masuk, Transaksi, Laporan, Pengguna, Pengaturan |
| **Alur Kasir** | Akses terbatas: Dashboard (terbatas), POS, Stok Masuk, Transaksi, Pengaturan |
| **Alur Demo** | Tanpa autentikasi â€” halaman publik `/demo/dashboard` dan `/demo/pos` dengan data contoh |
| **Rute Terlindungi** | Akses tanpa login ke rute terlindungi akan dialihkan ke `/sign-in?redirect=...` |

### Use Case Diagram

```mermaid
flowchart LR
    subgraph Aktor
        Pemilik["Pemilik (Owner)"]
        Kasir["Kasir (Cashier)"]
        Pengunjung["Pengunjung"]
    end

    subgraph Sistem["Sistem Warung Madura"]
        UC1["Masuk / Daftar"]
        UC2["Lihat Dashboard"]
        UC3["Proses Penjualan POS"]
        UC4["Catat Stok Masuk"]
        UC5["Lihat Riwayat Transaksi"]
        UC6["Kelola Produk CRUD"]
        UC7["Lihat Laporan Keuangan"]
        UC8["Ekspor Laporan CSV/PDF"]
        UC9["Kelola Pengguna"]
        UC10["Refund Transaksi"]
        UC11["Ubah Pengaturan"]
        UC12["Lihat Demo Dashboard"]
        UC13["Lihat Demo POS"]
    end

    Pemilik --- UC1
    Pemilik --- UC2
    Pemilik --- UC3
    Pemilik --- UC4
    Pemilik --- UC5
    Pemilik --- UC6
    Pemilik --- UC7
    Pemilik --- UC8
    Pemilik --- UC9
    Pemilik --- UC10
    Pemilik --- UC11

    Kasir --- UC1
    Kasir --- UC2
    Kasir --- UC3
    Kasir --- UC4
    Kasir --- UC5
    Kasir --- UC11

    Pengunjung --- UC12
    Pengunjung --- UC13

    UC7 -. "include" .-> UC8
    UC3 -. "include" .-> UC5
```

### Activity Diagram - Proses Penjualan POS

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Kasir membuka halaman POS"]
    B --> C["Pilih produk dan tentukan jumlah"]
    C --> D["Tambah item ke keranjang"]
    D --> E{"Tambah item lagi?"}
    E -->|"Ya"| C
    E -->|"Tidak"| F["Pilih metode pembayaran<br/>Tunai / QRIS / Transfer"]
    F --> G["Klik tombol Proses Penjualan"]
    G --> H{"Validasi stok<br/>semua item tersedia?"}
    H -->|"Stok tidak cukup"| I["Tampilkan pesan error<br/>stok tidak mencukupi"]
    I --> C
    H -->|"Stok tersedia"| J["Buat record transaksi"]
    J --> K["Simpan item transaksi<br/>dengan snapshot harga"]
    K --> L["Kurangi stok produk<br/>untuk setiap item"]
    L --> M["Catat log pergerakan stok<br/>tipe: keluar, referensi: transaksi"]
    M --> N["Transaksi berhasil<br/>status: completed"]
    N --> O(["Selesai"])

    classDef processNode fill:#3b82f6,stroke:#2563eb,color:#fff
    classDef decisionNode fill:#f59e0b,stroke:#d97706,color:#000
    classDef errorNode fill:#ef4444,stroke:#dc2626,color:#fff

    class B,C,D,F,G,J,K,L,M,N processNode
    class E,H decisionNode
    class I errorNode
```

### Sequence Diagram - Autentikasi dan Akses API

```mermaid
sequenceDiagram
    participant P as Pengguna (Browser)
    participant MW as Middleware Next.js
    participant API as API Route Handler
    participant AG as Auth Guard
    participant SB as Supabase Auth
    participant DB as Database PostgreSQL

    Note over P,DB: Proses Login
    P->>SB: POST /auth - email dan password
    SB-->>P: Sesi token (cookie)

    Note over P,DB: Akses Halaman Terlindungi
    P->>MW: GET /dashboard
    MW->>SB: Validasi cookie sesi
    SB-->>MW: Data sesi pengguna

    alt Sesi tidak valid
        MW-->>P: Redirect ke /sign-in?redirect=/dashboard
    else Sesi valid
        MW-->>P: Lanjutkan ke halaman
    end

    Note over P,DB: Panggilan API (contoh: buat transaksi)
    P->>API: POST /api/transactions
    API->>AG: getAuthContext()
    AG->>SB: Ambil sesi dari cookie
    SB-->>AG: Data sesi
    AG->>DB: Query profil pengguna dan peran
    DB-->>AG: Profil pengguna (pemilik/kasir)

    alt Pengguna tidak aktif
        AG-->>API: Error 403 - Akun dinonaktifkan
        API-->>P: Response 403
    else Pengguna aktif
        AG-->>API: AuthContext (userId, role)
        API->>DB: Validasi stok produk
        DB-->>API: Data stok tersedia
        API->>DB: INSERT transaksi, item, update stok, log movement
        DB-->>API: Transaksi berhasil
        API-->>P: Response 200 - Data transaksi
    end
```

### State Diagram - Status Transaksi

```mermaid
stateDiagram-v2
    [*] --> Dibuat : Kasir membuat transaksi baru

    Dibuat --> ValidasiStok : Sistem memeriksa ketersediaan stok

    ValidasiStok --> Gagal : Stok tidak mencukupi
    Gagal --> [*] : Transaksi dibatalkan, tampilkan error

    ValidasiStok --> Diproses : Stok tersedia untuk semua item

    Diproses --> Selesai : Stok dikurangi, pembayaran tercatat,\nlog pergerakan dibuat

    Selesai --> Direfund : Pemilik memproses refund
    Direfund --> [*] : Stok dikembalikan,\nlog pergerakan tipe masuk dicatat

    Selesai --> [*] : Transaksi final

    note right of Selesai
        Status: completed
        Stok sudah berkurang
        Metode bayar: Tunai/QRIS/Transfer
    end note

    note right of Direfund
        Status: refunded
        Stok dikembalikan ke produk
        Hanya bisa dari status completed
    end note
```

