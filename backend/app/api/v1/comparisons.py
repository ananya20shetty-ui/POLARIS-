from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.models import EvidenceComparison, Claim, ActivityEvent
from app.schemas.schemas import ComparisonCreateRequest, ComparisonResponse
from app.services.comparison_service import comparison_service

router = APIRouter(prefix="/comparisons", tags=["Evidence Comparison Engine"])

@router.get("", response_model=List[ComparisonResponse])
async def list_comparisons(
    topic: Optional[str] = Query(None),
    potential_disagreement: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    query = select(EvidenceComparison)
    if topic:
        query = query.filter(EvidenceComparison.topic.ilike(f"%{topic}%"))
    if potential_disagreement:
        query = query.filter(EvidenceComparison.potential_disagreement == potential_disagreement)

    query = query.order_by(EvidenceComparison.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{comparison_id}", response_model=ComparisonResponse)
async def get_comparison(comparison_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EvidenceComparison).filter_by(id=comparison_id))
    comp = result.scalar_one_or_none()
    if not comp:
        raise HTTPException(status_code=404, detail="Evidence comparison not found")
    return comp

@router.post("", response_model=ComparisonResponse)
async def create_comparison(payload: ComparisonCreateRequest, db: AsyncSession = Depends(get_db)):
    # Fetch claims
    claim_a_res = await db.execute(select(Claim).filter_by(id=payload.claim_a_id))
    claim_a = claim_a_res.scalar_one_or_none()

    claim_b_res = await db.execute(select(Claim).filter_by(id=payload.claim_b_id))
    claim_b = claim_b_res.scalar_one_or_none()

    if not claim_a or not claim_b:
        raise HTTPException(status_code=404, detail="One or both claims could not be found for comparison")

    # Run analytical comparison
    comp_data = comparison_service.compare_claims(claim_a, claim_b)

    comparison = EvidenceComparison(
        title=comp_data["title"],
        claim_a_id=claim_a.id,
        claim_b_id=claim_b.id,
        research_question_id=claim_a.research_question_id or claim_b.research_question_id,
        topic=comp_data["topic"],
        variable=comp_data["variable"],
        potential_disagreement=comp_data["potential_disagreement"],
        location_match=comp_data["location_match"],
        period_match=comp_data["period_match"],
        season_match=comp_data["season_match"],
        method_match=comp_data["method_match"],
        instrument_match=comp_data["instrument_match"],
        contextual_explanation=comp_data["contextual_explanation"],
        polaris_heuristic_score=comp_data["polaris_heuristic_score"],
        score_breakdown=comp_data["score_breakdown"]
    )
    db.add(comparison)
    await db.commit()
    await db.refresh(comparison)

    # Log activity
    activity = ActivityEvent(
        event_type="COMPARISON_GENERATED",
        actor_name="Evidence Comparison Engine",
        target_type="COMPARISON",
        target_id=comparison.id,
        target_title=comparison.title,
        details={"disagreement_level": comparison.potential_disagreement, "score": comparison.polaris_heuristic_score}
    )
    db.add(activity)
    await db.commit()

    return comparison
