"""FastAPI authorization dependencies — drop-in replacements for auth checks."""

from __future__ import annotations

from typing import Annotated, Sequence

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.auth.enums import PermissionEnum, RoleEnum
from app.auth.service import AuthorizationService
from app.core.security import decode_token
from app.models.database import get_db
from app.models.user import User

_bearer = HTTPBearer(auto_error=False)

auth_service = AuthorizationService()


# ── Base authentication ──────────────────────────────────────

async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing credentials")
    payload = decode_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    try:
        user_id = int(sub)
    except (TypeError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")
    return current_user


async def get_current_superadmin(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Superadmin access required")
    return current_user


async def get_current_with_rbac(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    """Load user with all RBAC relationships eagerly resolved."""
    return auth_service.load_user_with_rbac(db, current_user)


# ── Dependency factories ─────────────────────────────────────

def require_auth() -> Any:
    """Return a dependency that enforces authentication."""
    return Depends(get_current_active_user)


def require_role(*roles: RoleEnum | str):
    """Return a dependency that checks the user has at least one of the specified roles."""

    async def _check(user: User = Depends(get_current_with_rbac)) -> User:
        if not auth_service.has_any_role(user, *roles):
            role_names = ", ".join(r.value if isinstance(r, RoleEnum) else r for r in roles)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"One of the following roles is required: {role_names}",
            )
        return user

    return _check


def require_permission(*permissions: PermissionEnum | str):
    """Return a dependency that checks the user has ALL of the specified permissions."""

    async def _check(user: User = Depends(get_current_with_rbac)) -> User:
        if not auth_service.has_all_permissions(user, *permissions):
            perm_names = ", ".join(p.value if isinstance(p, PermissionEnum) else p for p in permissions)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permissions: {perm_names}",
            )
        return user

    return _check


def require_any_role(*roles: RoleEnum | str):
    """Alias for require_role — checks user has at least one of the given roles."""
    return require_role(*roles)


def require_all_permissions(*permissions: PermissionEnum | str):
    """Alias for require_permission — checks user has ALL given permissions."""
    return require_permission(*permissions)


def require_level(min_level: int):
    """Return a dependency that checks the user's role level is >= min_level."""

    async def _check(user: User = Depends(get_current_with_rbac)) -> User:
        if not auth_service.has_level_at_least(user, min_level):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient role level (required: {min_level})",
            )
        return user

    return _check


# ── Type aliases for route signatures ────────────────────────
from typing import Any
