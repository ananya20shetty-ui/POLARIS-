from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.models import StressTest, EvidenceComparison, Claim, Dataset, EvidenceGap, ActivityEvent
from app.schemas.schemas import StressTestCreateRequest, StressTestResponse
from app.services.stress_test_service import stress_test_service

router = APIRouter(prefix="/stress-test", tags=["⭐ Signature Evidence Stress-Test Engine"])

@router.get("", response_model=List[StressTestResponse])
async def list_stress_tests(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_db)):
    query = select(StressTest).order_by(StressTest.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{stress_test_id}", response_model=StressTestResponse)
async def get_stress_test(stress_test_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StressTest).filter_by(id=stress_test_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Stress test record not found")
    return item

@router.post("", response_model=StressTestResponse)
async def run_stress_test(payload: StressTestCreateRequest, db: AsyncSession = Depends(get_db)):
    # 1. Fetch Comparison
    comp_res = await db.execute(select(EvidenceComparison).filter_by(id=payload.comparison_id))
    comp = comp_res.scalar_one_or_none()
    if not comp:
        raise HTTPException(status_code=404, detail="Evidence comparison not found")

    # 2. Fetch Claims
    claim_a_res = await db.execute(select(Claim).filter_by(id=comp.claim_a_id))
    claim_a = claim_a_res.scalar_one_or_none()

    claim_b_res = await db.execute(select(Claim).filter_by(id=comp.claim_b_id))
    claim_b = claim_b_res.scalar_one_or_none()

    if not claim_a or not claim_b:
        raise HTTPException(status_code=404, detail="Associated claims not found")

    # 3. Fetch Datasets for matching
    ds_res = await db.execute(select(Dataset))
    available_datasets = ds_res.scalars().all()

    # 4. Run Stress-Test Sensitivity Simulation
    st_data = stress_test_service.run_stress_test(
        comparison=comp,
        claim_a=claim_a,
        claim_b=claim_b,
        override_location=payload.override_location,
        override_period=payload.override_period,
        override_season=payload.override_season,
        override_method=payload.override_method,
        available_datasets=available_datasets
    )

    stress_test = StressTest(
        comparison_id=comp.id,
        title=st_data["title"],
        variable_sensitivities=st_data["variable_sensitivities"],
        dominant_influential_variable=st_data["dominant_influential_variable"],
        explanation=st_data["explanation"],
        evidence_gap_description=st_data["evidence_gap_description"],
        recommended_dataset_code=st_data["recommended_dataset_code"],
        recommended_dataset_title=st_data["recommended_dataset_title"]
    )
    db.add(stress_test)
    await db.commit()
    await db.refresh(stress_test)

    # Add evidence gap entry
    gap = EvidenceGap(
        stress_test_id=stress_test.id,
        gap_type="CONTEXTUAL_RESOLUTION_GAP",
        missing_dimensions=st_data.get("missing_dimensions", []),
        description=stress_test.evidence_gap_description,
        suggested_queries=[f"{claim_a.location} {claim_a.subject}", f"{claim_b.location} satellite calibration"],
        matching_datasets=[stress_test.recommended_dataset_code] if stress_test.recommended_dataset_code else []
    )
    db.add(gap)

    activity = ActivityEvent(
        event_type="STRESS_TEST_EXECUTED",
        actor_name="Signature Stress-Test Engine",
        target_type="STRESS_TEST",
        target_id=stress_test.id,
        target_title=stress_test.title,
        details={"dominant_variable": stress_test.dominant_influential_variable, "dataset_linked": stress_test.recommended_dataset_code}
    )
    db.add(activity)
    await db.commit()

    return stress_test
