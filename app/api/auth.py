import logging
import re

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, field_validator
from typing import Optional

from app.models.database import get_db
from app.models.user import User
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.deps import get_current_user
from app.core.rate_limiter import limiter
from app.auth.enums import RoleEnum
from app.auth.models import Role, UserRole
from app.auth.service import AuthorizationService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

EMAIL_RE = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


def _find_user_by_identifier(db: Session, identifier: str) -> Optional[User]:
    identifier = identifier.strip()
    if EMAIL_RE.match(identifier):
        return db.query(User).filter(User.email == identifier.lower()).first()
    return db.query(User).filter(User.username == identifier).first()


class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not v:
            raise ValueError("Email is required")
        if not EMAIL_RE.match(v):
            raise ValueError("Invalid email format")
        return v

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Username is required")
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        if len(v) > 32:
            raise ValueError("Username must be at most 32 characters")
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v:
            raise ValueError("Password is required")
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                return None
        return v


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    is_active: bool
    created_at: Optional[str] = None
    roles: list[str] = []
    permissions: list[str] = []

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class LoginJSONRequest(BaseModel):
    identifier: str
    password: str

    @field_validator("identifier")
    @classmethod
    def validate_identifier(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Username or email is required")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v:
            raise ValueError("Password is required")
        return v


def _build_user_response(user: User, db: Session = None) -> UserResponse:
    roles: list[str] = []
    permissions: list[str] = []
    if db is not None:
        loaded = AuthorizationService.load_user_with_rbac(db, user)
        roles = [r.name for r in loaded.roles]
        permissions = sorted(AuthorizationService.get_effective_permissions(loaded))
    elif hasattr(user, "roles"):
        roles = [r.name for r in user.roles]
    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        is_active=user.is_active,
        created_at=str(user.created_at) if user.created_at else None,
        roles=roles,
        permissions=permissions,
    )


def _build_token_response(user: User, access_token: str, refresh_token: str, db: Session = None) -> TokenResponse:
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=_build_user_response(user, db),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()

    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
    )
    db.add(user)
    db.flush()

    student_role = db.query(Role).filter(Role.name == RoleEnum.STUDENT.value).first()
    if student_role:
        db.add(UserRole(user_id=user.id, role_id=student_role.id))

    db.commit()
    db.refresh(user)

    logger.info(f"New user registered: {user.username} (id={user.id})")

    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return _build_token_response(user, access_token, refresh_token, db)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = _find_user_by_identifier(db, form_data.username)

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact support.",
        )

    logger.info(f"User logged in: {user.username} (id={user.id})")

    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return _build_token_response(user, access_token, refresh_token, db)


@router.post("/login/json", response_model=TokenResponse)
@limiter.limit("10/minute")
def login_json(request: Request, form_data: LoginJSONRequest, db: Session = Depends(get_db)):
    user = _find_user_by_identifier(db, form_data.identifier)

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact support.",
        )

    logger.info(f"User logged in via JSON: {user.username} (id={user.id})")

    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return _build_token_response(user, access_token, refresh_token, db)


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("30/minute")
def refresh_token(request: Request, req: TokenRefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(req.refresh_token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = db.query(User).filter(User.id == user_id_int).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact support.",
        )

    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return _build_token_response(user, access_token, refresh_token, db)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _build_user_response(current_user, db)
