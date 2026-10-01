from typing import Dict, Any, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.core.database import get_db
from app.models.models import Document, Claim, Dataset, Expedition, ResearchQuestion
from app.services.embedding_service import embedding_service

router = APIRouter(prefix="/search", tags=["Universal Scientific Search"])

@router.get("/universal")
async def universal_search(
    q: str = Query(..., min_length=1, description="Search term e.g. 'sea ice thickness', 'Maitri', 'albedo'"),
    domain: str = Query(None),
    limit_per_category: int = 5,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    
    search_pat = f"%{q}%"
    q_emb = embedding_service.get_embedding(q)

    # 1. Documents
    doc_q = select(Document).filter(
        or_(
            Document.title.ilike(search_pat),
            Document.abstract.ilike(search_pat),
            Document.research_domain.ilike(search_pat),
            Document.location_name.ilike(search_pat)
        )
    ).limit(limit_per_category)
    doc_res = await db.execute(doc_q)
    docs = doc_res.scalars().all()

    # 2. Claims
    claim_q = select(Claim).filter(
        or_(
            Claim.subject.ilike(search_pat),
            Claim.observation.ilike(search_pat),
            Claim.location.ilike(search_pat),
            Claim.method.ilike(search_pat)
        )
    ).limit(limit_per_category)
    claim_res = await db.execute(claim_q)
    claims = claim_res.scalars().all()

    # 3. Datasets
    ds_q = select(Dataset).filter(
        or_(
            Dataset.title.ilike(search_pat),
            Dataset.code.ilike(search_pat),
            Dataset.location_name.ilike(search_pat),
            Dataset.instrument.ilike(search_pat)
        )
    ).limit(limit_per_category)
    ds_res = await db.execute(ds_q)
    datasets = ds_res.scalars().all()

    # 4. Expeditions
    exp_q = select(Expedition).filter(
        or_(
            Expedition.name.ilike(search_pat),
            Expedition.code.ilike(search_pat),
            Expedition.region.ilike(search_pat)
        )
    ).limit(limit_per_category)
    exp_res = await db.execute(exp_q)
    expeditions = exp_res.scalars().all()

    # 5. Research Questions
    rq_q = select(ResearchQuestion).filter(
        or_(
            ResearchQuestion.title.ilike(search_pat),
            ResearchQuestion.domain.ilike(search_pat)
        )
    ).limit(limit_per_category)
    rq_res = await db.execute(rq_q)
    research_questions = rq_res.scalars().all()

    return {
        "query": q,
        "total_results": len(docs) + len(claims) + len(datasets) + len(expeditions) + len(research_questions),
        "results": {
            "documents": [
                {
                    "id": d.id,
                    "title": d.title,
                    "type": d.document_type,
                    "year": d.year,
                    "authors": d.authors,
                    "domain": d.research_domain,
                    "location": d.location_name,
                    "source_type": d.source_type,
                    "verification_status": d.verification_status,
                    "doi": d.doi
                } for d in docs
            ],
            "claims": [
                {
                    "id": c.id,
                    "subject": c.subject,
                    "observation": c.observation,
                    "direction": c.direction,
                    "location": c.location,
                    "time_span": f"{c.time_start}-{c.time_end}" if c.time_start else "N/A",
                    "confidence": c.confidence,
                    "source_page": c.source_page
                } for c in claims
            ],
            "datasets": [
                {
                    "id": ds.id,
                    "title": ds.title,
                    "code": ds.code,
                    "instrument": ds.instrument,
                    "location": ds.location_name,
                    "format": ds.data_format,
                    "sha256": ds.file_hash_sha256
                } for ds in datasets
            ],
            "expeditions": [
                {
                    "id": e.id,
                    "name": e.name,
                    "code": e.code,
                    "region": e.region,
                    "year": e.year,
                    "stations": e.stations
                } for e in expeditions
            ],
            "research_questions": [
                {
                    "id": rq.id,
                    "title": rq.title,
                    "domain": rq.domain,
                    "status": rq.current_status
                } for rq in research_questions
            ]
        }
    }
