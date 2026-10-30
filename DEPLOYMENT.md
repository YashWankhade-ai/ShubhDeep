# 🪔 ShubhDeep — Production Deployment Guide

This guide walks you through deploying the full-stack ShubhDeep Diya e-commerce application using free-tier services:
- **Frontend**: [Cloudflare Pages](https://pages.cloudflare.com/) (Fast global edge delivery, free unlimited bandwidth)
- **Backend**: [Render](https://render.com/) (Python FastAPI + Uvicorn web service, free tier)
- **Database**: [Supabase](https://supabase.com/) (Managed PostgreSQL database, free 500MB tier)
- **Product Image Storage**: [Supabase Storage](https://supabase.com/storage) (Free 1GB object storage)

---

## Architecture Overview

```
                      +-----------------------------+
                      |   Cloudflare Pages (Edge)   |
                      |   React + Vite Frontend     |
                      +--------------+--------------+
                                     |
               HTTPS API Calls       |       WhatsApp Click-to-Chat
               (/api/v1/*)           |       (Client-side prefilled)
                                     v
                      +-----------------------------+
                      |       Render Web Service    |
                      |       Python FastAPI API    |
                      +-------+-------------+-------+
                              |             |
           SQLAlchemy ORM     |             | Supabase SDK
         (Transaction Pooler) |             | (Admin uploads)
                              v             v
                      +---------------+ +-------------------+
                      |   Supabase    | | Supabase Storage  |
                      |  PostgreSQL   | | (product-images)  |
                      +---------------+ +-------------------+
```

---

## Phase 1: Supabase Setup (PostgreSQL & Image Storage)

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Click **New Project** and name it `shubhdeep-db`.
3. Choose a strong database password and your preferred AWS region (e.g. `ap-south-1` Mumbai).
4. Wait 1–2 minutes for the database cluster to provision.

### 2. Retrieve Database Connection String
1. Go to **Project Settings** > **Database**.
2. Under **Connection string**, select the **URI** tab.
3. Choose **Transaction pooler (port 6543)** for serverless/app connection:
   ```
   postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
   ```
4. Copy this URI; you will supply it as `DATABASE_URL` in Render.

### 3. Create Image Storage Bucket
1. Go to **Storage** in the left menu.
2. Click **New Bucket**.
3. Name the bucket: `product-images`.
4. Toggle **Public bucket** to `ON` (so product images can be served directly to store visitors).
5. Click **Save**.
6. Go to **Project Settings** > **API**:
   - Copy the **Project URL** (`SUPABASE_URL`).
   - Copy the `service_role` key under **Project API keys** (`SUPABASE_SERVICE_ROLE_KEY`). Keep this safe and **never** expose it to frontend code.

---

## Phase 2: Render Backend Deployment (FastAPI)

### 1. Create a Web Service on Render
1. Log in to [Render](https://render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub/GitLab repository.
4. Fill in the deployment details:
   - **Name**: `shubhdeep-api`
   - **Region**: Singapore or nearest to your target audience.
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt && alembic upgrade head
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan**: Free

### 2. Configure Environment Variables on Render
Add the following under **Environment Variables**:

| Variable | Recommended Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require` | Supabase URI |
| `SECRET_KEY` | *(Generate a 64-character random hex string)* | Used for JWT admin tokens |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | 24 hours expiry |
| `ALLOWED_ORIGINS` | `https://shubhdeep.pages.dev,http://localhost:5173` | Add your Cloudflare domain |
| `INITIAL_ADMIN_EMAIL` | `admin@shubhdeep.in` | Store superadmin |
| `INITIAL_ADMIN_PASSWORD` | `YourSecureAdminPassword123!` | Change from default |
| `SUPABASE_URL` | `https://[PROJECT_REF].supabase.co` | From Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJh...` | From Supabase API settings |
| `SUPABASE_BUCKET` | `product-images` | Bucket created in Phase 1 |

Click **Create Web Service**. Render will install requirements, run Alembic migrations, initialize the superadmin user, and start the FastAPI service.

---

## Phase 3: Cloudflare Pages Frontend Deployment (React + Vite)

### 1. Create a Project on Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your ShubhDeep repository.
3. Configure the build parameters:
   - **Project Name**: `shubhdeep`
   - **Framework preset**: `Vite`
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### 2. Configure Environment Variables
Under **Environment variables (Advanced)**:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://shubhdeep-api.onrender.com` *(your Render backend URL)* |

4. Click **Save and Deploy**.
5. Once complete, Cloudflare will provide a URL like `https://shubhdeep.pages.dev`.

### 3. Update CORS on Render
Return to Render, update `ALLOWED_ORIGINS` to include your exact Cloudflare Pages or Vercel domain, and trigger a redeploy or restart.

---

## Phase 3B: Vercel Frontend Deployment (Alternative to Cloudflare)

### 1. Import Repository on Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository (`ShubhDeep`).
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (or leave as root; the included `vercel.json` automatically builds `frontend/dist`).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://shubhdeep-api.onrender.com` *(or your production backend URL)*
6. Click **Deploy**. Vercel will build and assign a live URL (e.g., `https://shubhdeep.vercel.app`).
7. The included `vercel.json` already contains single-page app (SPA) rewrites to ensure deep routes like `/shop`, `/product/:slug`, `/admin`, and `/account` work without 404s.

---

## Phase 4: Post-Deployment Verification Checklist

1. **Verify Backend Health**:
   - Visit `https://your-backend.onrender.com/api/v1/health` in your browser.
   - Expect: `{"status":"online","database":"healthy","version":"1.0.0"}`
2. **Verify Interactive API Docs**:
   - Visit `https://your-backend.onrender.com/docs` to test OpenAPI documentation.
3. **Verify Storefront**:
   - Open `https://shubhdeep.pages.dev`.
   - Verify that all collections, products, hero section, and photos render smoothly.
4. **Test Customer Cart & Checkout**:
   - Add diyas to the cart.
   - Proceed through the checkout drawer.
   - Place a test order and verify order reference number generation (`SD-YYYYMMDD-XXXX`).
   - Test prefilled WhatsApp order format.
5. **Test Admin Dashboard**:
   - Navigate to `https://shubhdeep.pages.dev/admin/login`.
   - Log in using your configured admin credentials.
   - Verify sales summary, inventory tracker, and category manager.
   - Change order status or adjust inventory quantities.
