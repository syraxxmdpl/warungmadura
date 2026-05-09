# Warung Madura â€” Sistem Informasi Persediaan & POS

A web-based inventory management and Point-of-Sale (POS) system built for **Warung Madura** (Indonesian convenience stores). The application enables store owners to monitor sales, stock levels, and financial reports in real-time from any device, while cashiers can efficiently process transactions and record incoming stock.

## Features

- ðŸ“Š **Real-Time Dashboard** â€” Live sales summary, transaction count, top products, sales trend chart (7-day), and low-stock alerts
- ðŸ›’ **Point of Sale (POS)** â€” Fast cashier interface for processing sales with multi-payment support (Cash, QRIS, Transfer) and automatic stock deduction
- ðŸ“¦ **Product Management** â€” Full CRUD for products with SKU, categories, purchase/selling price, stock levels, and minimum stock thresholds
- ðŸ“¥ **Stock-In (Restock)** â€” Record incoming inventory from suppliers with automatic stock increment and movement logging
- ðŸ’° **Transactions** â€” Complete transaction history with item details and status tracking
- ðŸ“ˆ **Financial Reports** â€” Daily, weekly, and monthly reports with revenue, cost (HPP), and gross profit calculations; export to CSV/PDF
- ðŸ‘¥ **User & Role Management** â€” Multi-user with `owner` (full access) and `cashier` (limited to POS & stock-in) roles
- ðŸ”’ **Authentication** â€” Supabase Auth with email/password, session-based middleware protection
- ðŸŒ™ **Dark Mode** â€” System preference detection with manual toggle
- ðŸ“± **Responsive Design** â€” Mobile-first, optimized for smartphones, tablets, and desktops
- ðŸŽ® **Demo Mode** â€” Public demo dashboard and POS pages (no login required)

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
- A **Supabase** project (free tier works) â€” [create one here](https://supabase.com/dashboard)
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
â”œâ”€â”€ app/                           # Next.js App Router
â”‚   â”œâ”€â”€ (app)/                     # Authenticated app routes (sidebar layout)
â”‚   â”‚   â”œâ”€â”€ dashboard/             # Real-time dashboard
â”‚   â”‚   â”œâ”€â”€ pos/                   # Point of Sale (cashier)
â”‚   â”‚   â”œâ”€â”€ products/              # Product management
â”‚   â”‚   â”œâ”€â”€ stock-in/              # Stock-in / restock
â”‚   â”‚   â”œâ”€â”€ transactions/          # Transaction history
â”‚   â”‚   â”œâ”€â”€ reports/               # Financial reports (owner only)
â”‚   â”‚   â”œâ”€â”€ users/                 # User management (owner only)
â”‚   â”‚   â”œâ”€â”€ settings/              # App settings
â”‚   â”‚   â”œâ”€â”€ account/               # User account
â”‚   â”‚   â”œâ”€â”€ billing/               # Billing info
â”‚   â”‚   â”œâ”€â”€ notifications/         # Notifications
â”‚   â”‚   â””â”€â”€ help/                  # Help & support
â”‚   â”œâ”€â”€ api/                       # API route handlers
â”‚   â”‚   â”œâ”€â”€ auth/                  # Authentication endpoints
â”‚   â”‚   â”œâ”€â”€ products/              # Product CRUD API
â”‚   â”‚   â”œâ”€â”€ categories/            # Category API
â”‚   â”‚   â”œâ”€â”€ suppliers/             # Supplier API
â”‚   â”‚   â”œâ”€â”€ transactions/          # Transaction API
â”‚   â”‚   â”œâ”€â”€ stock-ins/             # Stock-in API
â”‚   â”‚   â”œâ”€â”€ stock-movements/       # Stock movement log API
â”‚   â”‚   â”œâ”€â”€ reports/               # Report generation API
â”‚   â”‚   â”œâ”€â”€ users/                 # User management API
â”‚   â”‚   â”œâ”€â”€ account/               # Account API
â”‚   â”‚   â”œâ”€â”€ billing/               # Billing API
â”‚   â”‚   â”œâ”€â”€ notifications/         # Notifications API
â”‚   â”‚   â”œâ”€â”€ settings/              # Settings API
â”‚   â”‚   â””â”€â”€ demo/                  # Demo data API
â”‚   â”œâ”€â”€ auth/callback/             # Supabase auth callback
â”‚   â”œâ”€â”€ demo/                      # Public demo pages (no auth)
â”‚   â”œâ”€â”€ sign-in/                   # Sign-in page
â”‚   â”œâ”€â”€ sign-up/                   # Sign-up page
â”‚   â”œâ”€â”€ page.tsx                   # Landing page
â”‚   â”œâ”€â”€ layout.tsx                 # Root layout
â”‚   â””â”€â”€ globals.css                # Global styles
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ warung/                    # Feature-specific components
â”‚   â”‚   â”œâ”€â”€ dashboard-client.tsx   # Dashboard real-time client
â”‚   â”‚   â”œâ”€â”€ dashboard-kpis.tsx     # KPI summary cards
â”‚   â”‚   â”œâ”€â”€ sales-trend-chart.tsx  # 7-day sales trend chart
â”‚   â”‚   â”œâ”€â”€ live-transactions.tsx  # Live transaction feed
â”‚   â”‚   â”œâ”€â”€ low-stock-panel.tsx    # Low-stock alert panel
â”‚   â”‚   â”œâ”€â”€ top-products.tsx       # Top-selling products
â”‚   â”‚   â”œâ”€â”€ pos-screen.tsx         # POS cashier interface
â”‚   â”‚   â”œâ”€â”€ products-table.tsx     # Products data table
â”‚   â”‚   â”œâ”€â”€ stock-in-screen.tsx    # Stock-in form
â”‚   â”‚   â”œâ”€â”€ transactions-screen.tsx# Transaction history
â”‚   â”‚   â”œâ”€â”€ reports-screen.tsx     # Financial reports
â”‚   â”‚   â”œâ”€â”€ users-screen.tsx       # User management
â”‚   â”‚   â”œâ”€â”€ settings-screen.tsx    # Settings panel
â”‚   â”‚   â”œâ”€â”€ account-screen.tsx     # Account settings
â”‚   â”‚   â”œâ”€â”€ billing-screen.tsx     # Billing details
â”‚   â”‚   â”œâ”€â”€ notifications-screen.tsx # Notifications
â”‚   â”‚   â”œâ”€â”€ help-screen.tsx        # Help & support
â”‚   â”‚   â”œâ”€â”€ demo-dashboard-client.tsx # Demo dashboard
â”‚   â”‚   â”œâ”€â”€ demo-pos-screen.tsx    # Demo POS
â”‚   â”‚   â””â”€â”€ demo-sidebar.tsx       # Demo sidebar
â”‚   â”œâ”€â”€ ui/                        # shadcn/ui components (46+)
â”‚   â”œâ”€â”€ app-sidebar.tsx            # Main sidebar navigation
â”‚   â”œâ”€â”€ nav-main.tsx               # Primary nav items
â”‚   â”œâ”€â”€ nav-secondary.tsx          # Secondary nav items
â”‚   â”œâ”€â”€ nav-user.tsx               # User profile nav
â”‚   â”œâ”€â”€ site-header.tsx            # Page header
â”‚   â”œâ”€â”€ auth-buttons.tsx           # Auth action buttons
â”‚   â”œâ”€â”€ theme-provider.tsx         # Theme context provider
â”‚   â””â”€â”€ theme-toggle.tsx           # Dark/light mode toggle
â”œâ”€â”€ db/
â”‚   â”œâ”€â”€ index.ts                   # Database connection (Drizzle + pg)
â”‚   â””â”€â”€ schema/
â”‚       â”œâ”€â”€ auth.ts                # Auth schema (users, sessions)
â”‚       â””â”€â”€ warung.ts              # Business schema (products, transactions, etc.)
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ api/                       # API utilities
â”‚   â”‚   â”œâ”€â”€ auth-guard.ts          # Role-based route protection
â”‚   â”‚   â”œâ”€â”€ client.ts              # API client helpers
â”‚   â”‚   â”œâ”€â”€ responses.ts           # Standardized API responses
â”‚   â”‚   â””â”€â”€ validators.ts          # Zod request validators
â”‚   â”œâ”€â”€ services/                  # Business logic layer
â”‚   â”‚   â”œâ”€â”€ product.service.ts     # Product CRUD operations
â”‚   â”‚   â”œâ”€â”€ category.service.ts    # Category management
â”‚   â”‚   â”œâ”€â”€ supplier.service.ts    # Supplier management
â”‚   â”‚   â”œâ”€â”€ transaction.service.ts # Transaction processing
â”‚   â”‚   â”œâ”€â”€ stock-in.service.ts    # Stock-in processing
â”‚   â”‚   â”œâ”€â”€ stock-movement.service.ts # Movement log queries
â”‚   â”‚   â”œâ”€â”€ report.service.ts      # Report generation
â”‚   â”‚   â””â”€â”€ user.service.ts        # User management
â”‚   â”œâ”€â”€ warung/                    # Frontend utilities
â”‚   â”‚   â”œâ”€â”€ api.ts                 # Client-side API calls
â”‚   â”‚   â”œâ”€â”€ types.ts               # TypeScript interfaces
â”‚   â”‚   â”œâ”€â”€ format.ts              # Currency/date formatting
â”‚   â”‚   â”œâ”€â”€ export.ts              # CSV/PDF export helpers
â”‚   â”‚   â”œâ”€â”€ mock-data.ts           # Demo mock data
â”‚   â”‚   â””â”€â”€ demo-api.ts            # Demo API adapter
â”‚   â”œâ”€â”€ auth-client.ts             # Supabase auth client hooks
â”‚   â”œâ”€â”€ supabase.ts                # Browser Supabase client
â”‚   â”œâ”€â”€ supabase-server.ts         # Server-side Supabase client
â”‚   â””â”€â”€ utils.ts                   # General utilities (cn)
â”œâ”€â”€ scripts/
â”‚   â””â”€â”€ seed.ts                    # Database seeding script
â”œâ”€â”€ drizzle/                       # Drizzle migration files
â”œâ”€â”€ middleware.ts                   # Auth middleware (route protection)
â”œâ”€â”€ drizzle.config.ts              # Drizzle ORM configuration
â”œâ”€â”€ docker-compose.yaml            # Docker services (PostgreSQL)
â”œâ”€â”€ Dockerfile                     # Application container
â””â”€â”€ prd_warung_madura.md           # Product Requirements Document
```

## Diagram Teknis

Dokumentasi diagram lengkap tersedia di **[documentation/diagrams.md](documentation/diagrams.md)**, meliputi:

| Diagram | Deskripsi |
|---------|-----------|
| **Diagram Arsitektur** | Arsitektur berlapis: Klien, Server (API + Middleware + Services), Akses Data, Layanan Eksternal |
| **Diagram Arsitektur Sistem** | Infrastruktur deployment: perangkat pengguna, Vercel CDN, Supabase (Auth + DB), opsi Docker |
| **Peta Situs** | Semua rute aplikasi: halaman publik, demo, aplikasi (pemilik/kasir), dan 16 endpoint API |
| **Wireframe Antarmuka** | Tata letak UI: Dashboard, POS Kasir, Manajemen Produk, Laporan Keuangan |
| **Alur Pengguna** | Flowchart navigasi dari landing page hingga fitur berdasarkan peran |
| **Use Case Diagram** | Relasi 3 aktor (Pemilik, Kasir, Pengunjung) dengan 13 use case |
| **Activity Diagram** | Proses penjualan POS langkah demi langkah |
| **Sequence Diagram** | Alur autentikasi dan panggilan API antar komponen |
| **State Diagram** | Status transaksi: Dibuat, Selesai (completed), Direfund (refunded) |



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
   - `DATABASE_URL` â€” Supabase PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL` â€” Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` â€” Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` â€” Supabase service role key
   - `NEXT_PUBLIC_SITE_URL` â€” Your production domain

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

- **Demo Dashboard:** [/demo/dashboard](http://localhost:3000/demo/dashboard) â€” Browse a pre-populated dashboard with mock data
- **Demo POS:** [/demo/pos](http://localhost:3000/demo/pos) â€” Try the cashier interface with sample products

## Route Protection

All authenticated routes (`/dashboard`, `/products`, `/pos`, `/stock-in`, `/transactions`, `/reports`, `/users`) are protected by Next.js middleware that validates Supabase session cookies. Unauthenticated users are redirected to `/sign-in`. Owner-only routes (`/reports`, `/users`) enforce role-based access at the API level.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary. All rights reserved.
