from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import Claim
from app.schemas.schemas import ClaimResponse

router = APIRouter(prefix="/claims", tags=["Claim & Evidence Intelligence"])

@router.get("", response_model=List[ClaimResponse])
async def list_claims(
    subject: Optional[str] = Query(None, description="Filter by subject"),
    location: Optional[str] = Query(None, description="Filter by location"),
    direction: Optional[str] = Query(None, description="Filter by direction (DECREASE, INCREASE, STABLE, etc)"),
    verification_status: Optional[str] = Query(None, description="Filter by verification status"),
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    query = select(Claim).options(selectinload(Claim.evidence_items))

    if subject:
        query = query.filter(Claim.subject.ilike(f"%{subject}%"))
    if location:
        query = query.filter(Claim.location.ilike(f"%{location}%"))
    if direction:
        query = query.filter(Claim.direction == direction)
    if verification_status:
        query = query.filter(Claim.verification_status == verification_status)

    query = query.order_by(Claim.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    claims = result.scalars().all()
    return claims

@router.get("/{claim_id}", response_model=ClaimResponse)
async def get_claim(claim_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Claim).filter_by(id=claim_id).options(selectinload(Claim.evidence_items))
    )
    claim = result.scalar_one_or_none()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim
