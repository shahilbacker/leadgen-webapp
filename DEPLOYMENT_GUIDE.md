# 🌐 Complete 5-Minute Live Cloud Deployment Guide

This guide walks you through deploying the **ApexGrowth** full-stack application to the web for **100% free** with custom URLs and automatic SSL certificates.

---

## 🏗️ The Production Stack

| Component | Cloud Host | Cost | Setup Time |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) | Free | 2 min |
| **Backend API** | [Render](https://render.com) | Free | 2 min |
| **Relational Database** | [Supabase (PostgreSQL)](https://supabase.com) | Free | 1 min |
| **Audit Event DB** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Free | 1 min |

---

## Step 1: Push Project to GitHub

The local Git repository has already been initialized and committed on your machine.

1. Go to [github.com/new](https://github.com/new) and create a new repository named `leadgen-webapp` (public or private).
2. Open your terminal in `d:\DEVORAE\WebApp` and run:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/leadgen-webapp.git
   git push -u origin main
   ```

---

## Step 2: Set up Free Cloud Databases

### A. PostgreSQL on Supabase (Primary Leads Database)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Go to **SQL Editor** -> **New Query**, paste and run:
   ```sql
   CREATE TABLE IF NOT EXISTS leads (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     phone VARCHAR(50),
     message TEXT NOT NULL,
     source VARCHAR(100) DEFAULT 'landing_page',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
3. Go to **Project Settings** -> **API**, and copy:
   - **Project URL**
   - **service_role key** (secret)

### B. MongoDB Atlas (Audit Telemetry Database)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free **M0 Sandbox** cluster.
2. Under **Database Access**, create a user (e.g. `leadgen_admin` + password).
3. Under **Network Access**, add IP `0.0.0.0/0` (allow from anywhere).
4. Click **Connect** -> **Drivers** -> Copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/leadgen_audit?retryWrites=true&w=majority`

---

## Step 3: Deploy Backend on Render (Free)

1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.
2. Click **New +** -> **Web Service** -> Select your `leadgen-webapp` repository.
3. Configure the settings:
   - **Name**: `leadgen-backend-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_ACCESS_SECRET`: `your_random_secret_32_characters_long`
   - `JWT_REFRESH_SECRET`: `your_random_refresh_secret_32_characters`
   - `SUPABASE_URL`: *(from Step 2A)*
   - `SUPABASE_SERVICE_ROLE_KEY`: *(from Step 2A)*
   - `MONGODB_URI`: *(from Step 2B)*
   - `SMTP_USER`: *(your Gmail address if you want email alerts)*
   - `SMTP_PASS`: *(your Gmail 16-character App Password)*
   - `ADMIN_NOTIFICATION_EMAIL`: `your-email@example.com`
5. Click **Create Web Service**.
6. Once deployed, Render will provide your live API URL:
   `https://leadgen-backend-api-xxxx.onrender.com`
   *(Verify it by visiting `https://leadgen-backend-api-xxxx.onrender.com/health`)*

---

## Step 4: Deploy Frontend on Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** -> **Project** -> Import `leadgen-webapp`.
3. In the project configuration:
   - **Framework Preset**: `Next.js` (auto-detected)
   - **Root Directory**: Click **Edit** and select **`frontend`**
4. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: `https://leadgen-backend-api-xxxx.onrender.com/api`
   - `NEXT_PUBLIC_SITE_URL`: `https://your-project.vercel.app`
5. Click **Deploy**.
6. Within 60 seconds, your site is live with a public HTTPS URL (e.g. `https://leadgen-webapp.vercel.app`)!

---

## Step 5: Final CORS Update

Go back to Render dashboard -> your Web Service -> **Environment Variables**:
- Set `FRONTEND_URL` to your live Vercel URL (e.g. `https://leadgen-webapp.vercel.app`).
- Click **Save Changes** (Render will redeploy automatically).

---

## 🎉 Your Application is Live!
- **Landing Page**: Anyone in the world can visit your Vercel URL and submit leads.
- **Admin Dashboard**: Accessible at `https://your-project.vercel.app/admin/login` using your JWT credentials.
- **Automated Pipeline**: Inquiries are saved to PostgreSQL on Supabase, logged to MongoDB Atlas, and alerted to your email via Nodemailer.
