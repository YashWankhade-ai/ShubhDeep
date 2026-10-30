import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import engine, SessionLocal
from app.models.base import Base
from app.db.seed_data import seed_database

from app.api.routes import health, auth, customer_auth, products, categories, orders, admin, uploads

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    # Seed initial data if empty
    with SessionLocal() as db:
        seed_database(db)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Local static uploads directory mount
os.makedirs(settings.LOCAL_UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.LOCAL_UPLOAD_DIR), name="uploads")

# Include API Routers
app.include_router(health.router, prefix=settings.API_V1_PREFIX)
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(customer_auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(products.router, prefix=settings.API_V1_PREFIX)
app.include_router(categories.router, prefix=settings.API_V1_PREFIX)
app.include_router(orders.router, prefix=settings.API_V1_PREFIX)
app.include_router(admin.router, prefix=settings.API_V1_PREFIX)
app.include_router(uploads.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "message": "Welcome to ShubhDeep Diya E-Commerce API",
        "docs": f"{settings.API_V1_PREFIX}/docs",
        "health": f"{settings.API_V1_PREFIX}/health"
    }
