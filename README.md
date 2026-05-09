# Warung Madura — Sistem Informasi Persediaan & POS

A web-based inventory management and Point-of-Sale (POS) system built for **Warung Madura** (Indonesian convenience stores). The application enables store owners to monitor sales, stock levels, and financial reports in real-time from any device, while cashiers can efficiently process transactions and record incoming stock.

## Features

- 📊 **Real-Time Dashboard** — Live sales summary, transaction count, top products, sales trend chart (7-day), and low-stock alerts
- 🛒 **Point of Sale (POS)** — Fast cashier interface for processing sales with multi-payment support (Cash, QRIS, Transfer) and automatic stock deduction
- 📦 **Product Management** — Full CRUD for products with SKU, categories, purchase/selling price, stock levels, and minimum stock thresholds
- 📥 **Stock-In (Restock)** — Record incoming inventory from suppliers with automatic stock increment and movement logging
- 💰 **Transactions** — Complete transaction history with item details and status tracking
- 📈 **Financial Reports** — Daily, weekly, and monthly reports with revenue, cost (HPP), and gross profit calculations; export to CSV/PDF
- 👥 **User & Role Management** — Multi-user with `owner` (full access) and `cashier` (limited to POS & stock-in) roles
- 🔒 **Authentication** — Supabase Auth with email/password, session-based middleware protection
- 🌙 **Dark Mode** — System preference detection with manual toggle
- 📱 **Responsive Design** — Mobile-first, optimized for smartphones, tablets, and desktops
- 🎮 **Demo Mode** — Public demo dashboard and POS pages (no login required)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript |
| **Authentication** | [Supabase Auth](https://supabase.com/docs/guides/auth) (email/password) |
| **Database** | PostgreSQL via [Supabase](https://supabase.com/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (New York style, 46+ components) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Tabler Icons](https://tabler.io/icons) + [Lucide React](https://lucide.dev/) |
| **PDF Export** | [jsPDF](https://github.com/parallax/jsPDF) + jspdf-autotable |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) toast |

## Prerequisites

- **Node.js** 18+ installed
- A **Supabase** project (free tier works) — [create one here](https://supabase.com/dashboard)
- (Optional) Docker & Docker Compose for local PostgreSQL

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/warungpintar-1.0.git
cd warungpintar-1.0
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Supabase PostgreSQL connection string
# Get from: Supabase Dashboard > Settings > Database > Connection string
DATABASE_URL=postgresql://postgres.[project-ref]:[db-password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Supabase project credentials
# Get from: Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Push database schema

```bash
npm run db:push
```

### 5. (Optional) Seed sample data

```bash
npm run db:seed
```

### 6. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
warungpintar-1.0/
├── app/                           # Next.js App Router
│   ├── (app)/                     # Authenticated app routes (sidebar layout)
│   │   ├── dashboard/             # Real-time dashboard
│   │   ├── pos/                   # Point of Sale (cashier)
│   │   ├── products/              # Product management
│   │   ├── stock-in/              # Stock-in / restock
│   │   ├── transactions/          # Transaction history
│   │   ├── reports/               # Financial reports (owner only)
│   │   ├── users/                 # User management (owner only)
│   │   ├── settings/              # App settings
│   │   ├── account/               # User account
│   │   ├── billing/               # Billing info
│   │   ├── notifications/         # Notifications
│   │   └── help/                  # Help & support
│   ├── api/                       # API route handlers
│   │   ├── auth/                  # Authentication endpoints
│   │   ├── products/              # Product CRUD API
│   │   ├── categories/            # Category API
│   │   ├── suppliers/             # Supplier API
│   │   ├── transactions/          # Transaction API
│   │   ├── stock-ins/             # Stock-in API
│   │   ├── stock-movements/       # Stock movement log API
│   │   ├── reports/               # Report generation API
│   │   ├── users/                 # User management API
│   │   ├── account/               # Account API
│   │   ├── billing/               # Billing API
│   │   ├── notifications/         # Notifications API
│   │   ├── settings/              # Settings API
│   │   └── demo/                  # Demo data API
│   ├── auth/callback/             # Supabase auth callback
│   ├── demo/                      # Public demo pages (no auth)
│   ├── sign-in/                   # Sign-in page
│   ├── sign-up/                   # Sign-up page
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── warung/                    # Feature-specific components
│   │   ├── dashboard-client.tsx   # Dashboard real-time client
│   │   ├── dashboard-kpis.tsx     # KPI summary cards
│   │   ├── sales-trend-chart.tsx  # 7-day sales trend chart
│   │   ├── live-transactions.tsx  # Live transaction feed
│   │   ├── low-stock-panel.tsx    # Low-stock alert panel
│   │   ├── top-products.tsx       # Top-selling products
│   │   ├── pos-screen.tsx         # POS cashier interface
│   │   ├── products-table.tsx     # Products data table
│   │   ├── stock-in-screen.tsx    # Stock-in form
│   │   ├── transactions-screen.tsx# Transaction history
│   │   ├── reports-screen.tsx     # Financial reports
│   │   ├── users-screen.tsx       # User management
│   │   ├── settings-screen.tsx    # Settings panel
│   │   ├── account-screen.tsx     # Account settings
│   │   ├── billing-screen.tsx     # Billing details
│   │   ├── notifications-screen.tsx # Notifications
│   │   ├── help-screen.tsx        # Help & support
│   │   ├── demo-dashboard-client.tsx # Demo dashboard
│   │   ├── demo-pos-screen.tsx    # Demo POS
│   │   └── demo-sidebar.tsx       # Demo sidebar
│   ├── ui/                        # shadcn/ui components (46+)
│   ├── app-sidebar.tsx            # Main sidebar navigation
│   ├── nav-main.tsx               # Primary nav items
│   ├── nav-secondary.tsx          # Secondary nav items
│   ├── nav-user.tsx               # User profile nav
│   ├── site-header.tsx            # Page header
│   ├── auth-buttons.tsx           # Auth action buttons
│   ├── theme-provider.tsx         # Theme context provider
│   └── theme-toggle.tsx           # Dark/light mode toggle
├── db/
│   ├── index.ts                   # Database connection (Drizzle + pg)
│   └── schema/
│       ├── auth.ts                # Auth schema (users, sessions)
│       └── warung.ts              # Business schema (products, transactions, etc.)
├── lib/
│   ├── api/                       # API utilities
│   │   ├── auth-guard.ts          # Role-based route protection
│   │   ├── client.ts              # API client helpers
│   │   ├── responses.ts           # Standardized API responses
│   │   └── validators.ts          # Zod request validators
│   ├── services/                  # Business logic layer
│   │   ├── product.service.ts     # Product CRUD operations
│   │   ├── category.service.ts    # Category management
│   │   ├── supplier.service.ts    # Supplier management
│   │   ├── transaction.service.ts # Transaction processing
│   │   ├── stock-in.service.ts    # Stock-in processing
│   │   ├── stock-movement.service.ts # Movement log queries
│   │   ├── report.service.ts      # Report generation
│   │   └── user.service.ts        # User management
│   ├── warung/                    # Frontend utilities
│   │   ├── api.ts                 # Client-side API calls
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── format.ts              # Currency/date formatting
│   │   ├── export.ts              # CSV/PDF export helpers
│   │   ├── mock-data.ts           # Demo mock data
│   │   └── demo-api.ts            # Demo API adapter
│   ├── auth-client.ts             # Supabase auth client hooks
│   ├── supabase.ts                # Browser Supabase client
│   ├── supabase-server.ts         # Server-side Supabase client
│   └── utils.ts                   # General utilities (cn)
├── scripts/
│   └── seed.ts                    # Database seeding script
├── drizzle/                       # Drizzle migration files
├── middleware.ts                   # Auth middleware (route protection)
├── drizzle.config.ts              # Drizzle ORM configuration
├── docker-compose.yaml            # Docker services (PostgreSQL)
├── Dockerfile                     # Application container
└── prd_warung_madura.md           # Product Requirements Document
```

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

## Database Schema

The application uses a relational schema with the following core tables:

| Table | Description |
|-------|-------------|
| **users** | User accounts with `owner` or `cashier` role |
| **categories** | Product categories (e.g., Makanan Ringan, Minuman, Rokok, Sembako) |
| **products** | Product master data: SKU, name, prices, stock, min stock threshold |
| **suppliers** | Supplier/vendor information |
| **transactions** | Sales transaction headers (total, payment method, status) |
| **transaction_items** | Line items per transaction with price snapshots |
| **stock_ins** | Incoming stock headers from suppliers |
| **stock_in_items** | Line items per stock-in entry |
| **stock_movements** | Audit log for all stock changes (IN/OUT) |

```mermaid
erDiagram
    users {
        text id PK
        text name
        text email UK
        boolean email_verified
        text image
        text role "owner | cashier"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    categories {
        serial id PK
        text name UK
        text description
        timestamp created_at
    }

    products {
        serial id PK
        text sku UK
        text name
        integer category_id FK
        numeric purchase_price "precision 12,2"
        numeric selling_price "precision 12,2"
        text unit "default: pcs"
        integer current_stock
        integer min_stock
        timestamp created_at
        timestamp updated_at
    }

    suppliers {
        serial id PK
        text name
        text phone
        text address
        timestamp created_at
    }

    transactions {
        uuid id PK
        text user_id FK
        numeric total_amount "precision 14,2"
        numeric total_cost "precision 14,2"
        text payment_method "cash | qris | transfer"
        text status "completed | refunded"
        timestamp created_at
    }

    transaction_items {
        serial id PK
        uuid transaction_id FK
        integer product_id FK
        integer quantity
        numeric unit_price "precision 12,2"
        numeric unit_cost "precision 12,2"
        numeric subtotal "precision 14,2"
    }

    stock_ins {
        uuid id PK
        text user_id FK
        integer supplier_id FK
        numeric total_cost "precision 14,2"
        date received_date
        text notes
        timestamp created_at
    }

    stock_in_items {
        serial id PK
        uuid stock_in_id FK
        integer product_id FK
        integer quantity
        numeric unit_cost "precision 12,2"
    }

    stock_movements {
        serial id PK
        integer product_id FK
        text type "in | out"
        integer quantity
        text reference_type "transaction | stock_in | refund"
        uuid reference_id
        text notes
        text user_id FK
        timestamp created_at
    }

    users ||--o{ transactions : "mencatat"
    users ||--o{ stock_ins : "mencatat"
    users ||--o{ stock_movements : "melakukan"

    categories ||--o{ products : "memiliki"

    products ||--o{ transaction_items : "dijual di"
    products ||--o{ stock_in_items : "diterima di"
    products ||--o{ stock_movements : "dicatat di"

    suppliers ||--o{ stock_ins : "memasok"

    transactions ||--|{ transaction_items : "berisi"
    stock_ins ||--|{ stock_in_items : "berisi"
```

## User Roles

| Capability | Owner | Cashier |
|-----------|:-----:|:-------:|
| Dashboard | ✅ Full | ✅ Limited |
| POS / Sales | ✅ | ✅ |
| Product Management | ✅ CRUD | ❌ Read-only |
| Stock-In (Restock) | ✅ | ✅ |
| Transaction History | ✅ | ✅ |
| Financial Reports | ✅ | ❌ |
| User Management | ✅ | ❌ |
| Settings | ✅ | ✅ |

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
| **Alur Demo** | Tanpa autentikasi — halaman publik `/demo/dashboard` dan `/demo/pos` dengan data contoh |
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

## Development Commands

### Application

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

### Database

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:pull` | Pull schema from database |

### Docker (Local PostgreSQL)

| Command | Description |
|---------|-------------|
| `npm run db:up` | Start PostgreSQL container |
| `npm run db:down` | Stop PostgreSQL container |
| `npm run db:dev` | Start dev PostgreSQL (port 5433) |
| `npm run db:dev-down` | Stop dev PostgreSQL |
| `npm run docker:build` | Build application Docker image |
| `npm run docker:up` | Start full stack (app + database) |
| `npm run docker:down` | Stop all containers |
| `npm run docker:logs` | View container logs |

## Deployment

### Vercel + Supabase (Recommended)

1. **Push to GitHub** and connect the repository to [Vercel](https://vercel.com)

2. **Set environment variables** in the Vercel dashboard:
   - `DATABASE_URL` — Supabase PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
   - `NEXT_PUBLIC_SITE_URL` — Your production domain

3. **Push database schema:**
   ```bash
   npm run db:push
   ```

### Docker (Self-Hosted)

1. **Build and run:**
   ```bash
   docker build -t warung-madura .
   npm run docker:up
   ```

2. Configure `.env` with production database credentials

## Demo Mode

The application includes a fully functional demo mode accessible without authentication:

- **Demo Dashboard:** [/demo/dashboard](http://localhost:3000/demo/dashboard) — Browse a pre-populated dashboard with mock data
- **Demo POS:** [/demo/pos](http://localhost:3000/demo/pos) — Try the cashier interface with sample products

## Route Protection

All authenticated routes (`/dashboard`, `/products`, `/pos`, `/stock-in`, `/transactions`, `/reports`, `/users`) are protected by Next.js middleware that validates Supabase session cookies. Unauthenticated users are redirected to `/sign-in`. Owner-only routes (`/reports`, `/users`) enforce role-based access at the API level.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary. All rights reserved.
