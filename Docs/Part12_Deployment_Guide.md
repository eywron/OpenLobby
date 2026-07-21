OPENLOBBY MASTER AI SPECIFICATION

Part 12 — Full Production Deployment Guide

Version: V1.0

---

1. ARCHITECTURE & HOSTING OVERVIEW

OpenLobby consists of three distinct layers in production:
1. **Managed PostgreSQL Database** (Supabase, Neon, or Render PostgreSQL)
2. **Backend Express API** (Render, Railway, or Azure App Service)
3. **Frontend Next.js Application** (Vercel)

---

2. STEP 1: MANAGED DATABASE SETUP (PostgreSQL)

### Option A: Supabase (Recommended - Free Tier)
1. Sign up at [supabase.com](https://supabase.com) and create a new project named `openlobby-db`.
2. Set a strong database password and copy it.
3. Once initialized, go to **Project Settings -> Database -> Connection String**.
4. Copy the **URI** connection string:
   `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Database Migration
Run database migrations from your local environment or deployment pipeline:
```bash
cd backend
npx prisma migrate dev --name init
```

---

3. STEP 2: BACKEND DEPLOYMENT (Render / Railway)

### Deploying on Render (Free Tier Supported)
1. Log in to [render.com](https://render.com) and click **New + -> Web Service**.
2. Connect your GitHub repository: `eywron/OpenLobby`.
3. Configure the Web Service settings:
   - **Name**: `openlobby-api`
   - **Region**: Select closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

4. Environment Variables (Add under **Environment** tab):
   - `NODE_ENV` = `production`
   - `PORT` = `4000`
   - `DATABASE_URL` = `postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB]`
   - `JWT_ACCESS_SECRET` = `[Generate 64-char random string]`
   - `JWT_REFRESH_SECRET` = `[Generate 64-char random string]`
   - `CORS_ORIGIN` = `https://openlobby.vercel.app` (your frontend domain)

5. Click **Create Web Service**. Note the backend URL (e.g. `https://openlobby-api.onrender.com`).

---

4. STEP 3: FRONTEND DEPLOYMENT (Vercel)

1. Log in to [vercel.com](https://vercel.com) and click **Add New... -> Project**.
2. Import `eywron/OpenLobby` from GitHub.
3. Configure Project Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click Edit -> select `frontend`
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://openlobby-api.onrender.com/api/v1`
5. Click **Deploy**. Vercel will build and assign your production domain (e.g. `https://openlobby.vercel.app`).

---

5. STEP 4: CORS & SECURITY VERIFICATION

1. Update the `CORS_ORIGIN` environment variable on your backend (Render) to match your live Vercel domain (`https://openlobby.vercel.app`).
2. Verify API status by visiting `https://openlobby-api.onrender.com/api/v1/health`.
3. Test authentication: Navigate to your Vercel URL, click **Sign Up**, and create an account. Verify cookies and JWT access tokens function seamlessly across origins.

End of Part 12
