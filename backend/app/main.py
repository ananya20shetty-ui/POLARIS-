import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.db.seed_data import seed_database

# Import routers
from app.api.v1.auth import router as auth_router
from app.api.v1.documents import router as documents_router
from app.api.v1.claims import router as claims_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.comparisons import router as comparisons_router
from app.api.v1.stress_test import router as stress_test_router
from app.api.v1.search import router as search_router
from app.api.v1.temporal import router as temporal_router
from app.api.v1.research_questions import router as rq_router
from app.api.v1.rediscovery import router as rediscovery_router
from app.api.v1.expeditions import router as expeditions_router
from app.api.v1.datasets import router as datasets_router
from app.api.v1.learning import router as learning_router
from app.api.v1.admin import router as admin_router
from app.api.v1.evaluations import router as evaluations_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure storage folders exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.PROCESSED_DIR, exist_ok=True)
    
    # Initialize tables and seed baseline data
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    await seed_database()
    yield
    # Shutdown

app = FastAPI(
    title="POLARIS-Ω REST API",
    description="Polar Research Intelligence & Scientific Evidence System — Ministry of Earth Sciences (MoES) / NCPOR",
    version="1.0.0",
    docs_url=f"{settings.API_V1_STR}/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API V1 routers
api_prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=api_prefix)
app.include_router(documents_router, prefix=api_prefix)
app.include_router(claims_router, prefix=api_prefix)
app.include_router(evidence_router, prefix=api_prefix)
app.include_router(comparisons_router, prefix=api_prefix)
app.include_router(stress_test_router, prefix=api_prefix)
app.include_router(search_router, prefix=api_prefix)
app.include_router(temporal_router, prefix=api_prefix)
app.include_router(rq_router, prefix=api_prefix)
app.include_router(rediscovery_router, prefix=api_prefix)
app.include_router(expeditions_router, prefix=api_prefix)
app.include_router(datasets_router, prefix=api_prefix)
app.include_router(learning_router, prefix=api_prefix)
app.include_router(admin_router, prefix=api_prefix)
app.include_router(evaluations_router, prefix=api_prefix)

@app.get("/health", tags=["System Health"])
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "POLARIS-Ω Scientific Evidence API",
        "version": settings.VERSION,
        "organization": "MoES / NCPOR (SIH26063)"
    }
