from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.rbac import get_current_user, CurrentUserPayload
from app.models.models import User, AuditLog
from app.schemas.schemas import UserRegister, UserLogin, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

@router.post("/register", response_model=Token)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter_by(email=payload.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Restrict direct registration of ADMIN role
    role = payload.role if payload.role in ["STUDENT", "RESEARCHER"] else "RESEARCHER"
    
    user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        role=role,
        institution=payload.institution
    )
    db.add(user)
    
    audit = AuditLog(
        user_id=user.id,
        action="USER_REGISTER",
        resource="AUTH",
        details=f"Registered user {user.email} with role {user.role}"
    )
    db.add(audit)
    
    await db.commit()
    await db.refresh(user)
    
    access_token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=access_token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name
    )

@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter_by(email=payload.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    audit = AuditLog(
        user_id=user.id,
        action="USER_LOGIN",
        resource="AUTH",
        details=f"User {user.email} logged in successfully"
    )
    db.add(audit)
    await db.commit()
    
    access_token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=access_token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name
    )

@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: CurrentUserPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).filter_by(id=current_user.user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
