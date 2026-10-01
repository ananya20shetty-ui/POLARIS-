from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.models import Expedition, Station
from app.schemas.schemas import ExpeditionResponse

router = APIRouter(prefix="/expeditions", tags=["Polar Expeditions & Stations"])

@router.get("", response_model=List[ExpeditionResponse])
async def list_expeditions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Expedition).order_by(Expedition.year.desc()))
    return result.scalars().all()

@router.get("/stations")
async def list_stations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Station).order_by(Station.established_year.asc()))
    stations = result.scalars().all()
    return stations

@router.get("/{expedition_id}", response_model=ExpeditionResponse)
async def get_expedition(expedition_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Expedition).filter_by(id=expedition_id))
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Expedition not found")
    return exp
