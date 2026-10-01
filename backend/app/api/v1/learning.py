from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.rbac import get_current_user, CurrentUserPayload
from app.models.models import LearningPath, LearningModule, UserProgress
from app.schemas.schemas import LearningPathResponse, UserProgressUpdate

router = APIRouter(prefix="/learning", tags=["Polar Learning Hub"])

@router.get("/paths", response_model=List[LearningPathResponse])
async def list_learning_paths(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LearningPath).options(selectinload(LearningPath.modules)).order_by(LearningPath.created_at.asc())
    )
    return result.scalars().all()

@router.get("/paths/{slug_or_id}", response_model=LearningPathResponse)
async def get_learning_path(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LearningPath)
        .filter((LearningPath.id == slug_or_id) | (LearningPath.slug == slug_or_id))
        .options(selectinload(LearningPath.modules))
    )
    path = result.scalar_one_or_none()
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    return path

@router.post("/progress")
async def update_progress(
    payload: UserProgressUpdate,
    current_user: CurrentUserPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    if current_user.user_id == "anonymous":
        return {"status": "SUCCESS", "message": "Progress stored locally for anonymous learner."}

    result = await db.execute(
        select(UserProgress).filter_by(user_id=current_user.user_id, learning_module_id=payload.learning_module_id)
    )
    progress = result.scalar_one_or_none()
    if not progress:
        progress = UserProgress(
            user_id=current_user.user_id,
            learning_module_id=payload.learning_module_id,
            completed=payload.completed,
            quiz_score=payload.quiz_score
        )
        db.add(progress)
    else:
        progress.completed = payload.completed
        if payload.quiz_score is not None:
            progress.quiz_score = payload.quiz_score

    await db.commit()
    return {"status": "SUCCESS", "completed": progress.completed, "quiz_score": progress.quiz_score}
