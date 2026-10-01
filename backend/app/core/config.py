import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "POLARIS-Ω: Polar Research Intelligence & Scientific Evidence System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "polaris-omega-moes-ncpor-secret-key-2026-secure-salt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./polaris_omega.db")
    
    # Upload storage directory
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./storage/uploads")
    PROCESSED_DIR: str = os.getenv("PROCESSED_DIR", "./storage/processed")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    class Config:
        case_sensitive = True

settings = Settings()
