from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.models import Document
from app.services.rediscovery_service import rediscovery_service

router = APIRouter(prefix="/rediscovery", tags=["Research Rediscovery Engine"])

@router.get("/candidates")
async def get_rediscovery_candidates(
    query: str = Query("polar climate feedback ocean sea ice", description="Active scientific inquiry context"),
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    # Fetch all documents
    doc_res = await db.execute(select(Document))
    docs = doc_res.scalars().all()

    candidates = rediscovery_service.find_rediscovery_candidates(
        documents=docs,
        query_text=query,
        limit=limit
    )

    formatted_candidates = []
    for cand in candidates:
        d = cand["document"]
        formatted_candidates.append({
            "document_id": d.id,
            "title": d.title,
            "authors": d.authors,
            "year": d.year,
            "age_years": cand["age_years"],
            "research_domain": d.research_domain,
            "location_name": d.location_name,
            "methodology": d.methodology,
            "rediscovery_score": cand["rediscovery_score"],
            "semantic_similarity": cand["semantic_similarity"],
            "signals": cand["signals"],
            "why_surfaced": cand["why_surfaced"],
            "raw_data_availability": d.raw_data_availability,
            "doi": d.doi
        })

    return {
        "active_query": query,
        "total_candidates": len(formatted_candidates),
        "candidates": formatted_candidates
    }
