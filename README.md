# 🪔 ShubhDeep — Traditional Indian Diya E-Commerce Platform

> Full-stack e-commerce boutique for handcrafted Diwali diyas, decorative brass lamps, diya stands, and festive gifting hampers.

---

## 🌟 Overview

ShubhDeep has been transformed from a static showcase into a modern, full-stack, production-grade e-commerce application. It combines an authentic Indian festive aesthetic with a high-performance backend, resilient order processing, WhatsApp shopping integration, and a dedicated store admin dashboard.

### Key Highlights
- **Authentic Festive Aesthetic**: Deep maroon (`#641B25`), burgundy (`#42121B`), antique gold (`#C5A15B`), warm ivory (`#FFF8EC`), and terracotta (`#B85C38`) with traditional Cormorant Garamond typography and subtle diya flicker animations.
- **Authoritative Server Revalidation**: Prices, discounts, and inventory balances are strictly calculated and locked on the backend at checkout time.
- **Atomic Stock Deductions & Idempotency**: Concurrency-safe database transactions prevent overselling and duplicate submissions. Stock is automatically restored if an order is cancelled.
- **WhatsApp Direct Ordering**: Prefilled formatted order messages with customer details and line items, without claiming messages were sent until seller confirms.
- **Complete Admin Dashboard (`/admin`)**: Secure JWT-based administrative portal for managing products, categories, image uploads, stock levels, and order workflows.
- **Free-Tier Deployment Ready**: Preconfigured for Cloudflare Pages (Frontend), Render (FastAPI Backend), and Supabase (PostgreSQL + Image Storage).

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, React Router v6, Lucide React, Sonner |
| **Backend** | Python 3.13, FastAPI, Uvicorn, SQLAlchemy 2.0, Pydantic v2 |
| **Database & Migrations** | PostgreSQL / SQLite (local dev), Alembic migrations |
| **Authentication** | Argon2 / Bcrypt password hashing, JWT bearer tokens |
| **Storage** | Supabase Storage (production) / Local static fallback (development) |
| **Testing** | Pytest, FastAPI TestClient, in-memory SQLite isolation |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+

### 1. Clone & Set Up the Repository
```bash
git clone <repository-url>
cd ShubhDeep
```

### 2. Start the Backend (FastAPI)
```bash
cd backend

# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (creates SQLite tables automatically)
alembic upgrade head

# Start API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API will be running at:
- **API Base**: `http://localhost:8000/api/v1`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/v1/health`

### 3. Start the Frontend (React + Vite)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be running at: `http://localhost:5173`

---

## 🔐 Default Admin Credentials

Upon initial database seeding, a superadmin account is provisioned:

- **Login URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@shubhdeep.in`
- **Password**: `Admin@ShubhDeep2026`

*(Remember to change the admin password or override `INITIAL_ADMIN_PASSWORD` in your production `.env`)*

---

## 📦 Project Structure

```
ShubhDeep/
├── backend/
│   ├── alembic/              # Database migration versions
│   ├── app/
│   │   ├── api/              # Public & admin API routers (v1)
│   │   ├── core/             # Configuration & JWT security
│   │   ├── db/               # SQLAlchemy session, engine, initial seeds
│   │   ├── models/           # Database tables (Category, Product, Order, etc.)
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # Order, product, auth, and storage services
│   │   └── main.py           # FastAPI application & lifecycle hooks
│   ├── tests/                # Automated pytest test suite (16 tests)
│   ├── requirements.txt      # Python dependencies
│   └── alembic.ini           # Migration configuration
│
├── frontend/
│   ├── public/images/        # Original product photography & brand assets
│   ├── src/
│   │   ├── components/       # UI components (Header, Footer, CartDrawer, etc.)
│   │   ├── context/          # CartContext & AuthContext
│   │   ├── data/             # Static product fallback data
│   │   ├── pages/            # Public & admin pages
│   │   ├── services/         # Centralized API client (api.js)
│   │   └── App.jsx           # Routing configuration & route protection
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── DEPLOYMENT.md             # Detailed Cloudflare + Render + Supabase guide
└── README.md
```

---

## 🧪 Running Automated Tests

Backend tests run in an isolated in-memory database and test the entire order flow, concurrency safety, price verification, and admin routes:

```bash
cd backend
pytest tests/
```

Test coverage includes:
- [x] Health checks & database ping
- [x] Public product & category catalog fetching
- [x] Admin authentication & protected route enforcement
- [x] Order creation with authoritative server price calculation
- [x] Stock reduction and out-of-stock rejection
- [x] Order idempotency (preventing duplicate charges on network retry)
- [x] Order cancellation & automatic stock restoration
- [x] Inline inventory editing & category CRUD

---

## 🌐 Production Deployment

Refer to [DEPLOYMENT.md](file:///d:/ShubhDeep/DEPLOYMENT.md) for step-by-step instructions on deploying the application to **Cloudflare Pages**, **Render**, and **Supabase**.
