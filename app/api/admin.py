"""Admin API routes — user management, role management, audit logs, system info."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_with_rbac, require_permission, require_role
from app.auth.enums import PermissionEnum, RoleEnum
from app.auth.models import AuditLog, Role, UserPermission
from app.auth.service import AuthorizationService
from app.core.security import get_password_hash
from app.models.database import get_db
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])
svc = AuthorizationService()


# ── Schemas ──────────────────────────────────────────────────

class UserRoleAssign(BaseModel):
    user_id: int
    role_name: str


class UserPermOverride(BaseModel):
    user_id: int
    permission_name: str
    granted: bool = True


class UserAdminResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str | None
    is_active: bool
    is_superuser: bool
    roles: list[str]
    permissions: list[str]

    class Config:
        from_attributes = True


class RoleResponse(BaseModel):
    id: int
    name: str
    display_name: str
    description: str | None
    level: int
    is_system: bool
    permission_count: int

    class Config:
        from_attributes = True


class AuditLogResponse(BaseModel):
    id: int
    user_id: int | None
    action: str
    resource: str
    resource_id: str | None
    status_code: int | None
    ip_address: str | None
    created_at: str | None

    class Config:
        from_attributes = True


class SystemStats(BaseModel):
    total_users: int
    active_users: int
    total_roles: int
    total_permissions: int
    total_audit_logs: int


# ── Dashboard ────────────────────────────────────────────────

@router.get("/dashboard", summary="Admin dashboard stats")
async def admin_dashboard(
    user: User = Depends(require_permission(PermissionEnum.ADMIN_DASHBOARD)),
    db: Session = Depends(get_db),
) -> SystemStats:
    return SystemStats(
        total_users=db.query(User).count(),
        active_users=db.query(User).filter(User.is_active.is_(True)).count(),
        total_roles=db.query(Role).count(),
        total_permissions=db.query(UserPermission).count(),
        total_audit_logs=db.query(AuditLog).count(),
    )


# ── User management ──────────────────────────────────────────

@router.get("/users", summary="List all users")
async def list_users(
    user: User = Depends(require_permission(PermissionEnum.ADMIN_USERS)),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
) -> list[UserAdminResponse]:
    users = db.query(User).offset(skip).limit(limit).all()
    result = []
    for u in users:
        loaded = svc.load_user_with_rbac(db, u)
        perms = svc.get_effective_permissions(loaded)
        result.append(UserAdminResponse(
            id=u.id,
            email=u.email,
            username=u.username,
            full_name=u.full_name,
            is_active=u.is_active,
            is_superuser=u.is_superuser,
            roles=[r.name for r in u.roles],
            permissions=sorted(perms),
        ))
    return result


@router.post("/users/{user_id}/roles", summary="Assign role to user")
async def assign_role(
    user_id: int,
    body: UserRoleAssign,
    user: User = Depends(require_permission(PermissionEnum.USERS_ASSIGN_ROLE)),
    db: Session = Depends(get_db),
) -> dict:
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    role = db.query(Role).filter(Role.name == body.role_name).first()
    if not role:
        raise HTTPException(status_code=404, detail=f"Role '{body.role_name}' not found")

    from app.auth.models import UserRole
    existing = db.query(UserRole).filter(
        UserRole.user_id == user_id, UserRole.role_id == role.id
    ).first()
    if existing:
        return {"detail": f"User already has role '{body.role_name}'"}

    ur = UserRole(user_id=user_id, role_id=role.id, assigned_by=user.id)
    db.add(ur)
    db.commit()
    return {"detail": f"Role '{body.role_name}' assigned to user {user_id}"}


@router.delete("/users/{user_id}/roles/{role_name}", summary="Remove role from user")
async def remove_role(
    user_id: int,
    role_name: str,
    user: User = Depends(require_permission(PermissionEnum.USERS_ASSIGN_ROLE)),
    db: Session = Depends(get_db),
) -> dict:
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        raise HTTPException(status_code=404, detail=f"Role '{role_name}' not found")

    from app.auth.models import UserRole
    ur = db.query(UserRole).filter(
        UserRole.user_id == user_id, UserRole.role_id == role.id
    ).first()
    if not ur:
        raise HTTPException(status_code=404, detail="User does not have this role")

    db.delete(ur)
    db.commit()
    return {"detail": f"Role '{role_name}' removed from user {user_id}"}


@router.put("/users/{user_id}/active", summary="Activate/deactivate user")
async def toggle_user_active(
    user_id: int,
    is_active: bool,
    user: User = Depends(require_permission(PermissionEnum.USERS_UPDATE)),
    db: Session = Depends(get_db),
) -> dict:
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.is_active = is_active
    db.commit()
    return {"detail": f"User {'activated' if is_active else 'deactivated'}"}


@router.post("/users/{user_id}/permissions", summary="Grant/deny direct permission")
async def assign_permission(
    user_id: int,
    body: UserPermOverride,
    user: User = Depends(require_permission(PermissionEnum.PERMISSIONS_MANAGE)),
    db: Session = Depends(get_db),
) -> dict:
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    perm = db.query(UserPermission).filter(
        UserPermission.user_id == user_id,
        UserPermission.permission_id.in_(
            db.query(UserPermission.permission_id).subquery()
        ),
    ).first()

    from app.auth.models import Permission
    perm_obj = db.query(Permission).filter(Permission.name == body.permission_name).first()
    if not perm_obj:
        raise HTTPException(status_code=404, detail=f"Permission '{body.permission_name}' not found")

    existing = db.query(UserPermission).filter(
        UserPermission.user_id == user_id,
        UserPermission.permission_id == perm_obj.id,
    ).first()
    if existing:
        existing.granted = body.granted
    else:
        up = UserPermission(
            user_id=user_id,
            permission_id=perm_obj.id,
            granted=body.granted,
            assigned_by=user.id,
        )
        db.add(up)
    db.commit()
    return {"detail": f"Permission '{body.permission_name}' {'granted' if body.granted else 'denied'}"}


# ── Role management ──────────────────────────────────────────

@router.get("/roles", summary="List all roles")
async def list_roles(
    user: User = Depends(require_permission(PermissionEnum.ROLES_READ)),
    db: Session = Depends(get_db),
) -> list[RoleResponse]:
    roles = db.query(Role).order_by(Role.level).all()
    return [
        RoleResponse(
            id=r.id,
            name=r.name,
            display_name=r.display_name,
            description=r.description,
            level=r.level,
            is_system=r.is_system,
            permission_count=len(r.permissions),
        )
        for r in roles
    ]


# ── Audit logs ───────────────────────────────────────────────

@router.get("/logs", summary="Query audit logs")
async def list_audit_logs(
    user: User = Depends(require_permission(PermissionEnum.LOGS_READ)),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    action: str | None = None,
    resource: str | None = None,
    target_user_id: int | None = None,
) -> list[AuditLogResponse]:
    q = db.query(AuditLog)
    if action:
        q = q.filter(AuditLog.action == action)
    if resource:
        q = q.filter(AuditLog.resource == resource)
    if target_user_id:
        q = q.filter(AuditLog.user_id == target_user_id)
    logs = q.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return [
        AuditLogResponse(
            id=l.id,
            user_id=l.user_id,
            action=l.action,
            resource=l.resource,
            resource_id=l.resource_id,
            status_code=l.status_code,
            ip_address=l.ip_address,
            created_at=str(l.created_at) if l.created_at else None,
        )
        for l in logs
    ]
