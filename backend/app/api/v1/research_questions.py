from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import ResearchQuestion, Claim
from app.schemas.schemas import ResearchQuestionResponse

router = APIRouter(prefix="/research-questions", tags=["Research Question Tracker"])

@router.get("", response_model=List[ResearchQuestionResponse])
async def list_research_questions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ResearchQuestion).order_by(ResearchQuestion.created_at.desc()))
    return result.scalars().all()

@router.get("/{slug_or_id}")
async def get_research_question(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ResearchQuestion)
        .filter((ResearchQuestion.id == slug_or_id) | (ResearchQuestion.slug == slug_or_id))
        .options(selectinload(ResearchQuestion.claims))
    )
    rq = result.scalar_one_or_none()
    if not rq:
        raise HTTPException(status_code=404, detail="Research question not found")

    # Group claims into supporting / contrasting / neutral
    claims_data = []
    for c in rq.claims:
        claims_data.append({
            "id": c.id,
            "subject": c.subject,
            "observation": c.observation,
            "direction": c.direction,
            "location": c.location,
            "time_span": f"{c.time_start}-{c.time_end}" if c.time_start else "N/A",
            "method": c.method,
            "confidence": c.confidence,
            "source_page": c.source_page,
            "source_text_span": c.source_text_span,
            "verification_status": c.verification_status
        })

    return {
        "id": rq.id,
        "title": rq.title,
        "slug": rq.slug,
        "domain": rq.domain,
        "description": rq.description,
        "historical_context": rq.historical_context,
        "current_status": rq.current_status,
        "subquestions": rq.subquestions,
        "total_claims": len(claims_data),
        "claims": claims_data
    }
