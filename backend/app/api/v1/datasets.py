from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.models import Dataset
from app.schemas.schemas import DatasetResponse

router = APIRouter(prefix="/datasets", tags=["Scientific Datasets"])

@router.get("", response_model=List[DatasetResponse])
async def list_datasets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Dataset).order_by(Dataset.created_at.desc()))
    return result.scalars().all()

@router.get("/{dataset_id_or_code}", response_model=DatasetResponse)
async def get_dataset(dataset_id_or_code: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Dataset).filter((Dataset.id == dataset_id_or_code) | (Dataset.code == dataset_id_or_code))
    )
    ds = result.scalar_one_or_none()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return ds
