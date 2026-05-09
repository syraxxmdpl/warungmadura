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
