# 🎓 ApexGrowth — Full-Stack Technical Interview & Code Location Guide

> A complete reference guide detailing **where every core feature is located in the codebase**, **how it works under the hood**, and **the exact words to explain it to an interviewer**.

---

## 🗺️ Master Directory Map: Where Every Feature Lives

```
WebApp/
├── 📂 frontend/src/
│   ├── 📂 app/
│   │   ├── layout.tsx             → 📍 SEO, Google Search Console, Schema.org JSON-LD
│   │   ├── sitemap.ts            → 📍 XML Sitemap (/sitemap.xml)
│   │   ├── robots.ts             → 📍 Crawler Rules (/robots.txt)
│   │   ├── page.tsx              → 📍 Landing Page Composition
│   │   └── 📂 admin/
│   │       ├── login/page.tsx    → 📍 Admin Login Page (JWT login form + role switcher)
│   │       └── page.tsx          → 📍 Protected Admin Dashboard (MUI Table & RBAC)
│   ├── 📂 components/
│   │   ├── Hero.tsx              → 📍 Hero section (h1, KPI metrics, CTA buttons)
│   │   ├── Services.tsx          → 📍 Services grid (h2, 4 feature cards)
│   │   ├── Testimonials.tsx      → 📍 Social proof (h2, star ratings, reviewer avatars)
│   │   ├── LeadForm.tsx          → 📍 Lead capture form (client validation, REST submission)
│   │   └── Navbar.tsx & Footer.tsx
│   ├── 📂 context/
│   │   └── AuthContext.tsx       → 📍 Client-side JWT session state & token storage
│   ├── 📂 lib/
│   │   └── api.ts                → 📍 Frontend REST API Client (fetch wrapper functions)
│   └── 📂 theme/
│       ├── theme.ts              → 📍 Custom Material UI Design System (colors, shapes)
│       └── ThemeRegistry.tsx     → 📍 Emotion SSR Cache (prevents FOUC in App Router)
│
└── 📂 backend/src/
    ├── server.ts                 → 📍 Express server entrypoint & CORS configuration
    ├── 📂 config/
    │   └── db.ts                 → 📍 Supabase PostgreSQL Client & MongoDB connection
    ├── 📂 controllers/
    │   ├── authController.ts     → 📍 Login, Refresh Token, and Profile endpoints
    │   └── leadController.ts     → 📍 Lead CRUD & Zod input validation
    ├── 📂 middleware/
    │   └── auth.ts               → 📍 JWT verification & RBAC authorization middleware
    ├── 📂 models/
    │   ├── User.ts               → 📍 User repository, roles, & bcrypt password hashing
    │   └── AuditLog.ts           → 📍 MongoDB Mongoose Schema (with CQRS comments)
    ├── 📂 routes/
    │   ├── authRoutes.ts         → 📍 /api/auth routes
    │   └── leadRoutes.ts         → 📍 /api/leads routes (protected with RBAC)
    └── 📂 services/
        ├── leadService.ts        → 📍 Core orchestrator (Postgres + Mongo + Email)
        └── emailService.ts       → 📍 Nodemailer Gmail SMTP & HTML email templates
```

---

## ⚡ Quick Lookup Cheat Sheet

| If the interviewer asks about... | Point directly to these files: |
| :--- | :--- |
| **SEO & Meta Tags** | `frontend/src/app/layout.tsx` |
| **Google Search Console** | `layout.tsx` (lines 68–70) + `sitemap.ts` + `robots.ts` |
| **Google Business Profile / Schema** | `layout.tsx` (lines 74–130) |
| **JWT Access & Refresh Tokens** | `backend/src/controllers/authController.ts` |
| **RBAC (Admin vs. Viewer)** | `backend/src/middleware/auth.ts` & `backend/src/routes/leadRoutes.ts` |
| **Why PostgreSQL + MongoDB?** | `backend/src/models/AuditLog.ts` (detailed comments) |
| **Database Connections** | `backend/src/config/db.ts` & `backend/src/services/leadService.ts` |
| **Real-Time Email Notifications** | `backend/src/services/emailService.ts` |
| **Material UI Custom Styling** | `frontend/src/theme/theme.ts` & `ThemeRegistry.tsx` |
| **Protected Admin Dashboard** | `frontend/src/app/admin/page.tsx` & `context/AuthContext.tsx` |
| **Docker & Deployment** | `backend/Dockerfile`, `docker-compose.yml`, `render.yaml` |

---

# 🔍 Section-by-Section Deep Dive

---

### 1. 🌐 SEO, Google Search Console & Schema.org JSON-LD

#### 📍 Code Locations:
- **`frontend/src/app/layout.tsx`**
  - **Lines 8–67:** Open Graph (`og:title`, `og:image`), Twitter Card, canonical URLs, and keywords.
  - **Lines 68–70:** Google Search Console verification (`verification.google`).
  - **Lines 74–113:** Schema.org `ProfessionalService` JSON-LD object.
  - **Lines 127–130:** Injection into HTML `<head>` via `<script type="application/ld+json">`.
- **`frontend/src/app/sitemap.ts`:** Dynamic XML sitemap generator (`/sitemap.xml`).
- **`frontend/src/app/robots.ts`:** Crawler directive (`/robots.txt`) allowing `/` and disallowing `/admin`.

#### 🎙️ What to tell the interviewer:
> *"For search engine visibility, I engineered three levels of SEO:
> 1. **Next.js 14 Server-Side Rendering (SSR):** Crawlers receive fully rendered HTML on the initial HTTP response rather than an empty div.
> 2. **Google Search Console Integration:** I configured dynamic `sitemap.ts` and `robots.ts` files, and added the `verification.google` metadata property so domain ownership can be verified instantly.
> 3. **Google Business Profile & Structured Data:** In `layout.tsx`, I injected a Schema.org `ProfessionalService` JSON-LD schema containing our NAP (Name, Address, Phone), geolocation coordinates, operating hours, and a `sameAs` array linking directly to our Google Maps Business Profile. This enables Google to generate rich knowledge graph panels and local search cards."*

---

### 2. 🔐 JWT Authentication & Role-Based Access Control (RBAC)

#### 📍 Code Locations:
- **`backend/src/controllers/authController.ts`:** Issues short-lived Access Tokens (`15m`) and long-lived Refresh Tokens (`7d`); handles `/api/auth/login` and `/api/auth/refresh`.
- **`backend/src/middleware/auth.ts`:**
  - `authenticateToken`: Extracts `Authorization: Bearer <token>` and validates the signature.
  - `requireRole('admin')`: Blocks unauthorized roles with HTTP `403 Forbidden`.
- **`backend/src/models/User.ts`:** In-memory user repository with `bcryptjs` password hashing and pre-seeded demo accounts (`admin@example.com` / `viewer@example.com`).
- **`backend/src/routes/leadRoutes.ts`:** Protects lead management endpoints with RBAC middleware.
- **`frontend/src/context/AuthContext.tsx`:** Client-side auth provider managing tokens, login/logout, and role states (`isAdmin`, `isViewer`).

#### 🎙️ What to tell the interviewer:
> *"Authentication uses a dual-token JWT pattern. When a user logs in via `authController.ts`, passwords are verified using `bcryptjs`. The server issues a short-lived 15-minute access token for API requests and a 7-day refresh token for rotating sessions securely.
> 
> For authorization, I created custom Express middleware called `requireRole()`. The system supports two roles:
> - **Admin:** Full access to view, search, and permanently delete leads.
> - **Viewer:** Read-only access. In the frontend table, the delete button is disabled with an explanatory tooltip; if a viewer attempts to call `DELETE /api/leads/:id` directly, the backend middleware halts execution and returns an HTTP 403 Forbidden error."*

---

### 3. 🗄️ Database Layer: Polyglot Persistence (PostgreSQL + MongoDB)

#### 📍 Code Locations:
- **`backend/src/config/db.ts`:** Initializes the `@supabase/supabase-js` client (with an in-memory fallback for instant dev running) and the Mongoose MongoDB connection.
- **`backend/src/models/AuditLog.ts`:** Mongoose schema for raw submission events. Includes 40+ lines of architectural comments explaining CQRS.
- **`backend/src/services/leadService.ts`:** Coordinates writing structured data to PostgreSQL, append-only logs to MongoDB, and triggering email alerts.

#### 🎙️ What to tell the interviewer:
> *"I implemented polyglot persistence across two specialized databases:
> 1. **PostgreSQL (via Supabase):** Serves as our transactional **System of Record (SoR)**. It stores normalized, clean business records (`name`, `email`, `phone`, `message`, `source`, `created_at`) with ACID guarantees, relational indexing, and GDPR deletion compliance.
> 2. **MongoDB:** Serves as an append-only **Audit & Telemetry Event Store**. It captures raw request headers, client IP, browser User-Agent, referer links, and unmodified payloads.
> 
> **Why separate them?**
> - **Schema Drift:** If marketing introduces new UTM tags or click IDs, MongoDB accepts them without requiring SQL `ALTER TABLE` migrations.
> - **Write Contention:** Under high-traffic marketing campaigns, heavy write logging to MongoDB never locks or degrades performance on the primary relational CRM database.
> - **Non-Repudiation:** Even if an administrator deletes a lead in PostgreSQL, the historical audit log in MongoDB proves when and where the inquiry originated."*

---

### 4. 📬 Real-Time Notifications (Nodemailer & SMTP)

#### 📍 Code Locations:
- **`backend/src/services/emailService.ts`:** Configures the Nodemailer transporter with Google SMTP (`smtp.gmail.com:587`), formats a responsive HTML email alert, and sends it to `ADMIN_NOTIFICATION_EMAIL`. Includes an automatic fallback to an Ethereal test sandbox when credentials are not yet set.
- **`backend/.env`:** Stores `SMTP_USER=shahilbacker36@gmail.com`, `SMTP_PASS=qilcwdvxlzacjbnj` (Google App Password), and `ADMIN_NOTIFICATION_EMAIL=shahilbacker36@gmail.com`.

#### 🎙️ What to tell the interviewer:
> *"Real-time alerting is handled in `backend/src/services/emailService.ts`. The moment a lead is submitted, `leadService.ts` triggers Nodemailer asynchronously so the client HTTP response is never blocked. It connects to Google's SMTP servers using a secure 16-character Google App Password and dispatches a branded HTML notification containing the prospect's full contact details directly to the administrator's Gmail."*

---

### 5. 🎨 Frontend UI & Material UI (MUI) Design System

#### 📍 Code Locations:
- **`frontend/src/theme/theme.ts`:** Custom MUI theme configuration (Royal Blue `#2563eb` & Violet `#7c3aed`, 12px pill shapes, elevated hover cards, custom typography).
- **`frontend/src/theme/ThemeRegistry.tsx`:** Emotion Cache provider ensuring Next.js 14 App Router streams critical CSS on the server, eliminating Flash of Unstyled Content (FOUC).
- **`frontend/src/components/Hero.tsx`:** Semantic `<h1>` heading, value proposition, and KPI metric counter cards.
- **`frontend/src/components/Services.tsx`:** Semantic `<h2>` heading with 4 service capability cards.
- **`frontend/src/components/Testimonials.tsx`:** Semantic `<h2>` heading, 5-star ratings, and customer reviews.
- **`frontend/src/components/LeadForm.tsx`:** Interactive lead capture form with real-time validation, error states, and submission spinner.

#### 🎙️ What to tell the interviewer:
> *"On the frontend, I avoided default MUI styles by building a bespoke design system in `theme.ts`. Because Next.js 14 App Router executes on the server, traditional DOM style injection can cause hydration mismatches or unstyled content flashes. I solved this by engineering `ThemeRegistry.tsx` using `@emotion/cache` and `useServerInsertedHTML` to extract and stream critical styles during SSR. The landing page is split into clean, semantic components: `Hero.tsx`, `Services.tsx`, `Testimonials.tsx`, and `LeadForm.tsx`."*

---

### 6. 📊 Protected Admin Dashboard & RBAC UI

#### 📍 Code Locations:
- **`frontend/src/app/admin/page.tsx`:** The protected dashboard page. Checks `useAuth()`; redirects to `/admin/login` if unauthenticated. Renders the Material UI Table with real-time search, pagination, role badge, and role-conditioned delete action.
- **`frontend/src/app/admin/login/page.tsx`:** Login interface featuring quick-fill demo buttons for `admin` and `viewer` roles.

#### 🎙️ What to tell the interviewer:
> *"The admin portal is in `frontend/src/app/admin/page.tsx`. It is a client-side protected route that verifies the JWT session via `AuthContext`. It displays a paginated Material UI data table with instant multi-field search. Role-Based Access Control is visually and functionally enforced: Viewers see a disabled delete icon with an informative tooltip, while Admins have an active delete action with a confirmation modal that calls `DELETE /api/leads/:id`."*

---

### 7. 🐳 DevOps, Docker & Cloud Deployment

#### 📍 Code Locations:
- **`backend/Dockerfile`:** Multi-stage container build (Stage 1 compiles TypeScript; Stage 2 packages production dependencies under an unprivileged `node` user).
- **`docker-compose.yml`:** Local multi-container orchestration spinning up the Express backend and MongoDB 7.0 with persistent volumes and healthchecks.
- **`render.yaml`:** Infrastructure-as-Code blueprint to deploy the backend API to Render.
- **`DEPLOYMENT_GUIDE.md`:** 5-minute production deployment walkthrough.

#### 🎙️ What to tell the interviewer:
> *"For deployment and containerization, I wrote a multi-stage `Dockerfile` to produce small, hardened production images, and a `docker-compose.yml` file to spin up the backend and MongoDB locally with one command. For production, the backend is deployed as a live cloud Web Service on **Render**, the database runs on **Supabase (PostgreSQL)**, and the frontend is configured for global edge hosting on **Vercel**."*

---

# 🎤 The 60-Second Interview Elevator Pitch

*(Practice saying this out loud before your interview!)*

> *"The project I built is **ApexGrowth**, an enterprise-grade Lead Generation and Pipeline Management web application.
> 
> On the frontend, I used **Next.js 14 App Router** with **TypeScript** and **Material UI**. I engineered a custom theme with Emotion SSR caching to prevent FOUC, and implemented a complete SEO suite including dynamic sitemaps, robots.txt, and **Schema.org JSON-LD structured data** that links directly to our Google Business Profile on Google Maps.
> 
> On the backend, I built a decoupled **Node.js/Express REST API** with **Zod input validation** and **JWT authentication** using an Access/Refresh token rotation strategy. I implemented **Role-Based Access Control (RBAC)** with Admin and Viewer roles enforced at both the UI and API middleware levels.
> 
> For data storage, I implemented **polyglot persistence**: **PostgreSQL via Supabase** handles structured transactional leads, while **MongoDB** serves as an append-only audit log for raw telemetry to shield the relational database from write contention. 
> 
> Finally, every lead submission triggers real-time HTML notifications via **Nodemailer SMTP**, and the entire stack is containerized with **Docker** and deployed live on **Render and Supabase**."*
