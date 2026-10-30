import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "ShubhDeep API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = Field(
        default="sqlite:///./shubhdeep.db",
        description="PostgreSQL or SQLite connection string"
    )
    
    # JWT Authentication
    SECRET_KEY: str = Field(
        default="shubhdeep-super-secret-key-change-in-production-min32chars",
        description="JWT signing secret"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS
    ALLOWED_ORIGINS: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173,https://shubhdeep.pages.dev",
        description="Comma separated list of allowed CORS origins"
    )
    
    @property
    def cors_origins(self) -> List[str]:
        if not self.ALLOWED_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    # Supabase & Storage
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_BUCKET: str = "product-images"
    LOCAL_UPLOAD_DIR: str = "uploads"
    
    # Initial Admin Seed (used for safe setup command)
    INITIAL_ADMIN_EMAIL: str = "admin@shubhdeep.in"
    INITIAL_ADMIN_PASSWORD: str = "Admin@ShubhDeep2026"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore"
    }

settings = Settings()
