from enum import Enum
from typing import List
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings

class RoleEnum(str, Enum):
    PUBLIC = "PUBLIC"
    STUDENT = "STUDENT"
    RESEARCHER = "RESEARCHER"
    REVIEWER = "REVIEWER"
    ADMIN = "ADMIN"

# Role hierarchy levels for permission comparisons
ROLE_HIERARCHY = {
    RoleEnum.PUBLIC: 1,
    RoleEnum.STUDENT: 2,
    RoleEnum.RESEARCHER: 3,
    RoleEnum.REVIEWER: 4,
    RoleEnum.ADMIN: 5,
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

class CurrentUserPayload:
    def __init__(self, user_id: str, email: str, role: RoleEnum, full_name: str = ""):
        self.user_id = user_id
        self.email = email
        self.role = role
        self.full_name = full_name

async def get_optional_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUserPayload:
    if not token:
        return CurrentUserPayload(user_id="anonymous", email="public@polaris.moes.gov.in", role=RoleEnum.PUBLIC)
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role_str: str = payload.get("role", "PUBLIC")
        if user_id is None:
            return CurrentUserPayload(user_id="anonymous", email="public@polaris.moes.gov.in", role=RoleEnum.PUBLIC)
        return CurrentUserPayload(user_id=user_id, email=user_id, role=RoleEnum(role_str))
    except (JWTError, ValueError):
        return CurrentUserPayload(user_id="anonymous", email="public@polaris.moes.gov.in", role=RoleEnum.PUBLIC)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUserPayload:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role_str: str = payload.get("role")
        if user_id is None or role_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token claims",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return CurrentUserPayload(user_id=user_id, email=user_id, role=RoleEnum(role_str))
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_roles(allowed_roles: List[RoleEnum]):
    async def role_checker(current_user: CurrentUserPayload = Depends(get_current_user)):
        if current_user.role not in allowed_roles and current_user.role != RoleEnum.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[r.value for r in allowed_roles]}. Your role: {current_user.role.value}",
            )
        return current_user
    return role_checker
