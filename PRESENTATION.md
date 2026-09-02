# 🚀 ApexGrowth — Full-Stack Lead Generation Platform

> **A production-grade, enterprise-ready web application** built to capture, manage, and analyze high-intent B2B leads with real-time notifications, role-based access control, and a modern responsive UI.

---

## 📌 Project Overview

ApexGrowth is a **full-stack Lead Generation & CRM Ingestion Platform** that bridges the gap between a high-converting marketing landing page and a secure, data-driven admin pipeline. Built to demonstrate real-world software engineering standards — not just a tutorial toy.

| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router) · TypeScript · Material UI (MUI) v5 |
| **Backend** | Node.js · Express · TypeScript |
| **Primary Database** | PostgreSQL via Supabase |
| **Audit / Analytics DB** | MongoDB (Mongoose) |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **Authorization** | Role-Based Access Control (RBAC) |
| **Email Notifications** | Nodemailer (Gmail / Resend / Ethereal) |
| **Containerization** | Docker · Docker Compose |
| **SEO** | Open Graph · Twitter Cards · sitemap.xml · robots.txt |

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT BROWSER                               │
│                                                                         │
│   ┌──────────────────────┐          ┌───────────────────────────────┐  │
│   │  Landing Page :3000  │          │  Admin Dashboard :3000/admin  │  │
│   │  (Next.js App Router)│          │  (Protected JWT Route)        │  │
│   └──────────┬───────────┘          └──────────────┬────────────────┘  │
└──────────────┼──────────────────────────────────────┼───────────────────┘
               │ POST /api/leads                       │ GET/DELETE /api/leads
               │ (Public)                              │ Bearer <JWT Token>
               ▼                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    NODE.JS + EXPRESS REST API (:5000)                   │
│                                                                         │
│   ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────────┐ │
│   │  JWT Auth    │  │  RBAC Middleware  │  │  Zod Input Validation    │ │
│   │  Middleware  │  │  (admin/viewer)   │  │                          │ │
│   └──────────────┘  └──────────────────┘  └──────────────────────────┘ │
│                              │                                          │
│              ┌───────────────┼──────────────────┐                      │
│              ▼               ▼                  ▼                      │
│   ┌─────────────────┐ ┌────────────┐ ┌──────────────────┐             │
│   │  Lead Service   │ │   Auth     │ │  Email Service   │             │
│   │  (Orchestrator) │ │ Controller │ │  (Nodemailer)    │             │
│   └────────┬────────┘ └────────────┘ └──────────────────┘             │
│            │                                    │                       │
│     ┌──────┴──────┐                    ┌────────▼──────────┐           │
│     ▼             ▼                    │  Admin Email Inbox │           │
│  ┌──────┐   ┌──────────┐              └───────────────────┘           │
│  │ SQL  │   │ MongoDB  │                                               │
│  │ Leads│   │ AuditLog │                                               │
│  └──────┘   └──────────┘                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
WebApp/
├── 📄 README.md                         ← Full setup & API documentation
├── 📄 docker-compose.yml                ← Runs Backend + MongoDB locally
├── 📄 .gitignore
│
├── 📂 backend/                          ← Node.js + Express REST API
│   ├── 🐳 Dockerfile                    ← Multi-stage production container
│   ├── 📄 .env.example                  ← Environment variable template
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   └── 📂 src/
│       ├── ⚙️  config/db.ts             ← PostgreSQL + MongoDB setup
│       ├── 🎮 controllers/
│       │   ├── authController.ts        ← Login, Refresh, Me endpoints
│       │   └── leadController.ts        ← CRUD for leads
│       ├── 🛡️  middleware/auth.ts        ← JWT verification + RBAC guards
│       ├── 📊 models/
│       │   ├── AuditLog.ts              ← MongoDB schema (with architecture comments)
│       │   └── User.ts                  ← In-memory user repo (pre-seeded)
│       ├── 🔀 routes/
│       │   ├── authRoutes.ts
│       │   └── leadRoutes.ts
│       ├── ⚡ services/
│       │   ├── emailService.ts          ← Nodemailer HTML notifications
│       │   └── leadService.ts           ← Core orchestration layer
│       └── 🚀 server.ts                 ← Express entrypoint
│
└── 📂 frontend/                         ← Next.js 14 (App Router)
    ├── 📄 .env.example
    ├── 📄 next.config.js
    └── 📂 src/
        ├── 📂 app/
        │   ├── layout.tsx               ← SEO, OpenGraph, ThemeRegistry
        │   ├── page.tsx                 ← Landing Page composition
        │   ├── robots.ts                ← /robots.txt (dynamic)
        │   ├── sitemap.ts               ← /sitemap.xml (dynamic)
        │   └── 📂 admin/
        │       ├── login/page.tsx       ← JWT Login UI
        │       └── page.tsx             ← Protected Admin Dashboard
        ├── 📂 components/
        │   ├── Navbar.tsx               ← Responsive nav with mobile drawer
        │   ├── Hero.tsx                 ← h1 + KPI metric cards + CTA
        │   ├── Services.tsx             ← h2 + 4 service cards
        │   ├── Testimonials.tsx         ← h2 + social proof grid
        │   ├── LeadForm.tsx             ← Lead capture form
        │   └── Footer.tsx               ← Semantic footer
        ├── 📂 context/AuthContext.tsx   ← JWT session state manager
        ├── 📂 lib/api.ts                ← Typed REST client
        └── 📂 theme/
            ├── theme.ts                 ← Custom MUI theme (colors, fonts, cards)
            └── ThemeRegistry.tsx        ← Emotion cache → Next.js SSR safe
```

---

## 🎨 Frontend Features

### Landing Page Sections

#### 1. 🏠 Hero Section
- Semantic `<h1>` headline with gradient text treatment
- High-converting subheading and dual CTA buttons (_"Get Free Pipeline Audit"_ + _"Explore Solutions"_)
- Trust badges: GDPR Compliant · Guaranteed SQL Delivery · Live in 7 Days
- **Three KPI metric cards** with animated counters:
  - `340%` Average Pipeline Acceleration
  - `94.8%` Lead Qualification Accuracy
  - `$48.5M` Closed ARR Sourced in 2025

#### 2. 🛠️ Services Section
- Semantic `<h2>` header
- **4 Interactive Service Cards** with custom icons:
  - High-Intent Inbound Funnels
  - Account-Based Target Penetration
  - Automated Lead Qualification
  - CRM & Pipeline Integration
- Feature checklists inside each card

#### 3. ⭐ Testimonials Section
- Semantic `<h2>` header
- **3 Enterprise Social Proof Cards** with:
  - Colour-coded Avatar initials
  - 5-Star MUI `Rating` component
  - Italicised customer quotes
  - Role, company and name attribution

#### 4. 📬 Lead Capture Form
- Fields: **Name · Email · Phone · Message**
- Client-side validation before API submission
- Backend Zod validation with field-level error mapping
- Loading spinner on submit button during network request
- **Success alert** on completion
- **Error alert** with backend validation messages

### Custom Material UI Design System

| Element | Customization |
| :--- | :--- |
| Primary Color | Royal Blue `#2563eb` |
| Secondary Color | Violet `#7c3aed` |
| Success Color | Emerald `#10b981` |
| Border Radius | `12px` (standard) / `16px` (cards) |
| Typography | System font stack, `800` weight headlines |
| Card Hover | Lift `translateY(-3px)` + deeper shadow |
| Button Hover | Lift `translateY(-1px)` + color glow |

### SEO Configuration

| Tag | Implementation |
| :--- | :--- |
| `<title>` | Dynamic via Next.js `Metadata` API |
| `description` | Set in `layout.tsx` |
| `og:title`, `og:image`, `og:description` | Full Open Graph suite |
| `twitter:card` | `summary_large_image` |
| `/sitemap.xml` | Auto-generated via `src/app/sitemap.ts` |
| `/robots.txt` | Auto-generated via `src/app/robots.ts`, `/admin` is disallowed from crawlers |

---

## 🔐 Authentication & Security

### JWT Dual-Token Strategy

```
Client                           Backend
  │                                │
  │  POST /api/auth/login          │
  │  { email, password }  ──────►  │
  │                                │  1. Verify bcrypt hash
  │                                │  2. Generate Access Token (15m)
  │                                │  3. Generate Refresh Token (7d)
  │  { accessToken, refreshToken } │
  │  ◄──────────────────────────   │
  │                                │
  │  GET /api/leads                │
  │  Authorization: Bearer <AT> ►  │
  │                                │  4. Verify JWT signature
  │  { leads data }                │  5. Check role permissions
  │  ◄──────────────────────────   │
  │                                │
  │  POST /api/auth/refresh        │  AT expires after 15 min
  │  { refreshToken }     ──────►  │  6. Validate RT, issue new AT
  │  { accessToken }               │
  │  ◄──────────────────────────   │
```

### Role-Based Access Control (RBAC)

| Route | Method | Admin | Viewer | Public |
| :--- | :--- | :---: | :---: | :---: |
| `/api/leads` | `POST` | ✅ | ✅ | ✅ |
| `/api/leads` | `GET` | ✅ | ✅ | ❌ 401 |
| `/api/leads/:id` | `DELETE` | ✅ | ❌ 403 | ❌ 401 |
| `/api/auth/login` | `POST` | ✅ | ✅ | ✅ |
| `/api/auth/refresh` | `POST` | ✅ | ✅ | ✅ |
| `/api/auth/me` | `GET` | ✅ | ✅ | ❌ 401 |

### Demo Credentials

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@example.com` | `AdminPass123!` | View, search, **delete** leads |
| 👁️ **Viewer** | `viewer@example.com` | `ViewerPass123!` | View and search leads only |

---

## 🗄️ Database Design — Polyglot Persistence

### Why Two Databases?

```
┌─────────────────────────────────┐    ┌───────────────────────────────────┐
│   PostgreSQL (via Supabase)      │    │         MongoDB                   │
│   System of Record (SoR)         │    │   Append-Only Event Store         │
├─────────────────────────────────┤    ├───────────────────────────────────┤
│ ✅ ACID Transactions             │    │ ✅ Schema Flexibility              │
│ ✅ Relational Integrity          │    │ ✅ High-Throughput Writes          │
│ ✅ Indexing & Complex Queries    │    │ ✅ No Migration Risk               │
│ ✅ Clean Sales/CRM Data          │    │ ✅ Immutable Audit Trail           │
│ ✅ GDPR Deletion Support         │    │ ✅ Raw Telemetry Capture           │
├─────────────────────────────────┤    ├───────────────────────────────────┤
│ Stores: name, email, phone,      │    │ Stores: IP address, User-Agent,   │
│ message, source, created_at      │    │ referer, raw JSON payload,        │
│                                  │    │ validation outcome, leadId ref    │
└─────────────────────────────────┘    └───────────────────────────────────┘
         Sales team uses this                  Analytics / Audit team uses this
```

### PostgreSQL Schema

```sql
CREATE TABLE IF NOT EXISTS leads (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  phone       VARCHAR(50),
  message     TEXT          NOT NULL,
  source      VARCHAR(100)  DEFAULT 'landing_page',
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);
```

### MongoDB AuditLog Schema

```typescript
{
  eventType:    String,   // 'LEAD_FORM_SUBMISSION'
  ipAddress:    String,   // Client IP
  userAgent:    String,   // Browser / Bot fingerprint
  referer:      String,   // Referring URL
  rawPayload:   Mixed,    // Full unmodified request body
  status:       Enum,     // 'SUCCESS' | 'VALIDATION_FAILED' | 'ERROR'
  errorMessage: String,   // Validation detail (if failed)
  leadId:       String,   // Reference to PostgreSQL lead
  createdAt:    Date      // Auto-timestamped (append-only)
}
```

---

## 📧 Email Notification System

When a lead is submitted, Nodemailer sends a **responsive HTML email** to the admin:

```
╔════════════════════════════════════════════╗
║  ⚡ New Lead Generated!                   ║
║  High-priority inquiry from landing page  ║
╠════════════════════════════════════════════╣
║  Source:   landing_page_main              ║
║  Name:     Jane Doe                       ║
║  Email:    jane.doe@enterprise.com        ║
║  Phone:    +1 (555) 432-1098              ║
║  Date:     Tuesday, September 2, 2026     ║
║                                           ║
║  Message:                                 ║
║  ┃ "Interested in enterprise pipeline     ║
║  ┃  acceleration consulting..."           ║
║                                           ║
║  → Admin Dashboard: localhost:3000/admin  ║
╚════════════════════════════════════════════╝
```

**SMTP Configuration Priority:**
1. 🏭 **Production**: Gmail App Password / Resend / Sendgrid (via `.env`)
2. 🧪 **Development**: Ethereal auto-mailbox (link logged to terminal)
3. 🔌 **Offline**: JSON mock transport (no crashes, no blocking)

---

## 🎛️ Admin Dashboard

### Features

- **Protected Route**: Unauthenticated users are automatically redirected to `/admin/login`
- **Role Badge**: Top bar displays `ADMIN` (blue) or `VIEWER` (grey) chip
- **Real-time Search**: Filter leads by name, email, phone, message, or source
- **Paginated Table**: 5 / 10 / 25 leads per page
- **Lead Table Columns**: Contact Name · Email & Phone · Message Preview · Source Badge · Date & Time · Action

### RBAC Delete Behavior

```
Admin View:                          Viewer View:
┌──────────────────────────┐         ┌──────────────────────────┐
│  Jane Doe    [🗑 Delete] │         │  Jane Doe    [🗑 Locked] │
│  (active red button)     │         │  (disabled, tooltip:     │
│                          │         │  "Viewer role: Read-only │
│  Click → Confirmation    │         │   access. Deleting       │
│  Dialog → DELETE API     │         │   requires Admin.")      │
└──────────────────────────┘         └──────────────────────────┘
```

---

## 🐳 Docker Setup

### docker-compose.yml Services

```yaml
services:
  backend:     # Express REST API (Port 5000)
    build: ./backend
    environment:
      - MONGODB_URI=mongodb://mongo:27017/leadgen_audit
    depends_on:
      mongo:
        condition: service_healthy

  mongo:       # MongoDB 7.0 (Port 27017)
    image: mongo:7.0
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: mongosh --eval "db.adminCommand('ping')"
```

### Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build (TypeScript → JavaScript)
FROM node:20-alpine AS builder
COPY . .
RUN npm ci && npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
USER node          # Non-root for container security
CMD ["node", "dist/server.js"]
```

---

## 🧪 Verified Test Results

All features were live-tested against the running backend:

```
✅ GET  /health                              → status: "healthy"
✅ POST /api/auth/login (viewer)             → accessToken issued, role: "viewer"
✅ POST /api/leads                           → Lead created, UUID assigned
✅ GET  /api/leads (viewer token)            → 2 leads returned
✅ DELETE /api/leads/:id (viewer token)      → 403 Forbidden (RBAC working)
✅ POST /api/auth/login (admin)              → accessToken issued, role: "admin"
✅ DELETE /api/leads/:id (admin token)       → 200 OK, lead removed
✅ next build                                → 8 routes compiled, 0 errors
✅ tsc (backend)                             → 0 TypeScript errors
```

### Frontend Build Output

```
Route (app)                   Size     First Load JS
┌ ○ /                         23.5 kB    183 kB
├ ○ /admin                    25 kB      184 kB
├ ○ /admin/login              4.28 kB    164 kB
├ ○ /robots.txt               0 B        0 B
└ ○ /sitemap.xml              0 B        0 B
```

---

## ⚡ Quick Start

### Local Development (No Docker)

```bash
# 1. Start Backend API
cd backend
npm install
npm run dev        # → http://localhost:5000

# 2. Start Frontend (new terminal)
cd frontend
npm install
npm run dev        # → http://localhost:3000
```

### With Docker Compose

```bash
# Starts Backend + MongoDB in containers
docker compose up --build
```

### Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
MONGODB_URI=mongodb://127.0.0.1:27017/leadgen_audit
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
ADMIN_NOTIFICATION_EMAIL=admin@yourcompany.com
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📡 API Reference

### Public

```http
POST /api/leads
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@enterprise.com",
  "phone": "+1 555-432-1098",
  "message": "Interested in enterprise pipeline acceleration.",
  "source": "landing_page"
}
```

### Authentication

```http
POST /api/auth/login          → { accessToken, refreshToken, user }
POST /api/auth/refresh        → { accessToken }
GET  /api/auth/me             → { user: { id, name, email, role } }
```

### Protected (Bearer Token Required)

```http
GET    /api/leads             → All leads (admin + viewer)
DELETE /api/leads/:id         → Delete lead (admin ONLY)
```

---

## 🧱 Key Engineering Decisions

| Decision | Rationale |
| :--- | :--- |
| **App Router over Pages Router** | Better layouts, streaming SSR, and built-in Metadata API for SEO |
| **Decoupled backend** | Allows independent scaling, containerization, and future microservice extraction |
| **Access + Refresh token pair** | Short-lived access tokens limit exposure window; refresh tokens enable persistent sessions |
| **In-memory user store** | Eliminates setup friction for demo/dev while maintaining the same repository interface |
| **In-memory PostgreSQL fallback** | Backend runs instantly without Supabase credentials — no `DATABASE_URL required` errors |
| **MongoDB for audit** | Schema-free, append-only writes protect primary SQL from write contention under load |
| **Nodemailer + Ethereal fallback** | Email alerts never crash the app — Ethereal provides testable preview URLs in dev |
| **Multi-stage Dockerfile** | Final image contains zero dev dependencies; non-root `node` user for container hardening |
| **Emotion cache (`ThemeRegistry`)** | Prevents Flash of Unstyled Content (FOUC) when using MUI in Next.js App Router SSR |

---

## 👨‍💻 Author

> **Devorae** — Full-Stack Enterprise Web Application  
> Built with ❤️ using Next.js · Express · TypeScript · MUI · Supabase · MongoDB · Docker

---

*Project scaffolded and documented: September 2026*
