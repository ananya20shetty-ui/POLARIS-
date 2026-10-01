from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.models import Document, Claim, Expedition, Dataset

router = APIRouter(prefix="/temporal", tags=["Temporal Research Explorer"])

@router.get("/timeline")
async def get_temporal_timeline(
    topic: Optional[str] = Query("Antarctic sea ice", description="Scientific inquiry topic"),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    # 1. Fetch documents
    doc_res = await db.execute(select(Document).order_by(Document.year.asc().nullslast()))
    docs = doc_res.scalars().all()

    # 2. Fetch claims
    claim_res = await db.execute(select(Claim).order_by(Claim.time_start.asc().nullslast()))
    claims = claim_res.scalars().all()

    # 3. Fetch expeditions
    exp_res = await db.execute(select(Expedition).order_by(Expedition.year.asc()))
    expeditions = exp_res.scalars().all()

    # Group timeline items by year
    timeline_events = []
    
    # Categorize Evidence Landscape
    supporting_count = sum(1 for c in claims if c.direction == "DECREASE")
    contrasting_count = sum(1 for c in claims if c.direction == "INCREASE")
    uncertain_count = sum(1 for c in claims if c.direction in ["FLUCTUATING", "CYCLIC", "STABLE"])

    for d in docs:
        if d.year:
            timeline_events.append({
                "type": "DOCUMENT",
                "id": d.id,
                "year": d.year,
                "title": d.title,
                "subtitle": f"{', '.join(d.authors[:2])} ({d.year})",
                "domain": d.research_domain,
                "location": d.location_name or "Polar Region",
                "evidence_status": "INDEXED_PRIMARY_SOURCE",
                "doi": d.doi
            })

    for c in claims:
        if c.time_start:
            landscape_category = "Supporting" if c.direction == "DECREASE" else ("Contrasting" if c.direction == "INCREASE" else "Uncertain")
            timeline_events.append({
                "type": "CLAIM",
                "id": c.id,
                "year": c.time_start,
                "title": f"Claim: {c.subject}",
                "subtitle": f"{c.observation} ({c.location})",
                "domain": "Cryospheric Evidence",
                "location": c.location,
                "evidence_status": landscape_category,
                "confidence": c.confidence,
                "source_page": c.source_page
            })

    for e in expeditions:
        timeline_events.append({
            "type": "EXPEDITION",
            "id": e.id,
            "year": e.year,
            "title": f"Expedition: {e.name}",
            "subtitle": f"{e.code} - Stations: {', '.join(e.stations)}",
            "domain": "Field Campaign",
            "location": e.region,
            "evidence_status": "OFFICIAL_EXPEDITION"
        })

    timeline_events.sort(key=lambda x: x["year"])

    return {
        "topic": topic,
        "total_events": len(timeline_events),
        "evidence_landscape": {
            "supporting_evidence_count": supporting_count,
            "contrasting_evidence_count": contrasting_count,
            "uncertain_evidence_count": uncertain_count,
            "insufficient_evidence_warning": len(claims) < 3,
            "description": "Multi-decadal evidence landscape reflects distinct regional polar sub-systems rather than a singular homogeneous trend."
        },
        "decadal_breakdown": [
            {"decade": "1990-1999", "event_count": sum(1 for ev in timeline_events if 1990 <= ev["year"] < 2000)},
            {"decade": "2000-2009", "event_count": sum(1 for ev in timeline_events if 2000 <= ev["year"] < 2010)},
            {"decade": "2010-2019", "event_count": sum(1 for ev in timeline_events if 2010 <= ev["year"] < 2020)},
            {"decade": "2020-2026", "event_count": sum(1 for ev in timeline_events if 2020 <= ev["year"] <= 2026)}
        ],
        "events": timeline_events
    }
