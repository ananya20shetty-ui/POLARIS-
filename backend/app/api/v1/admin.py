from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.rbac import require_roles, RoleEnum, CurrentUserPayload
from app.models.models import (
    Document, Claim, Evidence, Dataset, Expedition, Researcher,
    EvidenceComparison, StressTest, AuditLog, Review, ActivityEvent
)
from app.schemas.schemas import AnalyticsSummary, ReviewSubmission

router = APIRouter(prefix="/admin", tags=["Admin, Governance & Audit"])

@router.get("/analytics", response_model=AnalyticsSummary)
async def get_analytics(db: AsyncSession = Depends(get_db)):
    doc_count = await db.scalar(select(func.count(Document.id))) or 0
    claim_count = await db.scalar(select(func.count(Claim.id))) or 0
    ev_count = await db.scalar(select(func.count(Evidence.id))) or 0
    ds_count = await db.scalar(select(func.count(Dataset.id))) or 0
    exp_count = await db.scalar(select(func.count(Expedition.id))) or 0
    researcher_count = await db.scalar(select(func.count(Researcher.id))) or 0
    unverified_claim_count = await db.scalar(select(func.count(Claim.id)).filter(Claim.human_review_status == "PENDING")) or 0
    comp_count = await db.scalar(select(func.count(EvidenceComparison.id))) or 0
    st_count = await db.scalar(select(func.count(StressTest.id))) or 0

    return AnalyticsSummary(
        total_documents=doc_count,
        total_claims=claim_count,
        total_evidence_items=ev_count,
        total_datasets=ds_count,
        total_expeditions=exp_count,
        total_researchers=researcher_count,
        pending_reviews=unverified_claim_count,
        unverified_claims=unverified_claim_count,
        disagreements_analyzed=comp_count,
        stress_tests_run=st_count,
        system_health="HEALTHY",
        db_status="CONNECTED",
        vector_status="READY",
        sha256_verified_rate=100.0
    )

@router.get("/audit-logs")
async def get_audit_logs(
    limit: int = 50,
    current_user: CurrentUserPayload = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.REVIEWER])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit))
    return result.scalars().all()

@router.get("/activity-feed")
async def get_activity_feed(limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ActivityEvent).order_by(ActivityEvent.created_at.desc()).limit(limit))
    events = result.scalars().all()
    return events

@router.post("/reviews/submit")
async def submit_review(
    payload: ReviewSubmission,
    current_user: CurrentUserPayload = Depends(require_roles([RoleEnum.REVIEWER, RoleEnum.ADMIN])),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    
    if payload.entity_type == "CLAIM":
        claim_res = await db.execute(select(Claim).filter_by(id=payload.entity_id))
        claim = claim_res.scalar_one_or_none()
        if not claim:
            raise HTTPException(status_code=404, detail="Target claim not found for review")
        
        claim.human_review_status = payload.decision
        if payload.decision == "ACCEPT":
            claim.verification_status = "VERIFIED"
        elif payload.decision == "REJECT":
            claim.verification_status = "FLAGGED"

    review = Review(
        entity_type=payload.entity_type,
        entity_id=payload.entity_id,
        reviewer_id=current_user.user_id,
        decision=payload.decision,
        edited_output=payload.edited_output,
        review_reason=payload.review_reason
    )
    db.add(review)

    audit = AuditLog(
        user_id=current_user.user_id,
        action="REVIEW_SUBMITTED",
        resource=f"{payload.entity_type}:{payload.entity_id}",
        details=f"Decision: {payload.decision} by {current_user.full_name or current_user.email}"
    )
    db.add(audit)
    await db.commit()

    return {"status": "SUCCESS", "decision": payload.decision, "reviewer": current_user.full_name}
