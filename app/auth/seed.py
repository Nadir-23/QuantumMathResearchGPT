"""Seed roles, permissions, and demo accounts into the database — run once at startup."""

from __future__ import annotations

import logging
from sqlalchemy.orm import Session

from app.auth.enums import (
    ActionEnum,
    PermissionEnum,
    ResourceEnum,
    RoleEnum,
    ROLE_HIERARCHY,
    ROLE_PERMISSIONS,
)
from app.auth.models import Permission, Role, RolePermission
from app.models.user import User
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)


def seed_roles_and_permissions(db: Session) -> None:
    """Idempotent: skips if roles already exist."""

    existing = db.query(Role).first()
    if existing is not None:
        return

    # ── 1. Create all permissions ───────────────────────────
    perm_map: dict[str, Permission] = {}
    for perm in PermissionEnum:
        parts = perm.value.split(".")
        resource = parts[0]
        action = parts[1] if len(parts) > 1 else "unknown"
        p = Permission(
            name=perm.value,
            resource=resource,
            action=action,
            description=f"{action.capitalize()} {resource}",
        )
        db.add(p)
        perm_map[perm.value] = p

    db.flush()

    # ── 2. Create all roles ─────────────────────────────────
    role_map: dict[str, Role] = {}
    display_names = {
        RoleEnum.GUEST: "Guest",
        RoleEnum.STUDENT: "Student",
        RoleEnum.RESEARCHER: "Researcher",
        RoleEnum.VERIFIED_RESEARCHER: "Verified Researcher",
        RoleEnum.PREMIUM_USER: "Premium User",
        RoleEnum.MODERATOR: "Moderator",
        RoleEnum.AGENT_MANAGER: "Agent Manager",
        RoleEnum.RESEARCH_MANAGER: "Research Manager",
        RoleEnum.ADMIN: "Administrator",
        RoleEnum.SUPER_ADMIN: "Super Administrator",
    }
    descriptions = {
        RoleEnum.GUEST: "Unauthenticated visitor with minimal access",
        RoleEnum.STUDENT: "Basic user with chat and math/quantum access",
        RoleEnum.RESEARCHER: "Full researcher with project and paper management",
        RoleEnum.VERIFIED_RESEARCHER: "Verified researcher who can publish papers",
        RoleEnum.PREMIUM_USER: "Premium subscriber with advanced features",
        RoleEnum.MODERATOR: "Content moderator with review capabilities",
        RoleEnum.AGENT_MANAGER: "Can configure and manage AI agents",
        RoleEnum.RESEARCH_MANAGER: "Manages research projects and datasets",
        RoleEnum.ADMIN: "Full administrative access",
        RoleEnum.SUPER_ADMIN: "Ultimate system administrator",
    }
    for role_enum in RoleEnum:
        r = Role(
            name=role_enum.value,
            display_name=display_names[role_enum],
            description=descriptions.get(role_enum, ""),
            level=ROLE_HIERARCHY[role_enum],
            is_system=True,
            is_active=True,
        )
        db.add(r)
        role_map[role_enum.value] = r

    db.flush()

    # ── 3. Assign permissions to roles (inheritance-aware) ──
    seen_perms: dict[str, set[str]] = {}
    for role_enum in RoleEnum:
        accumulated = set(seen_perms.get(RoleEnum(RoleEnum.GUEST).name, set()))
        for perm in ROLE_PERMISSIONS.get(role_enum, []):
            accumulated.add(perm.value)
        seen_perms[role_enum.value] = accumulated

        role = role_map[role_enum.value]
        for perm_name in accumulated:
            perm = perm_map.get(perm_name)
            if perm:
                rp = RolePermission(role_id=role.id, permission_id=perm.id)
                db.add(rp)

    db.commit()


def seed_demo_accounts(db: Session) -> None:
    """Create demo admin and user accounts if they don't exist. Dev only."""

    demo_users = [
        {
            "email": "admin@example.com",
            "username": "admin",
            "password": "Admin123!",
            "full_name": "Demo Administrator",
            "role": RoleEnum.ADMIN,
        },
        {
            "email": "user@example.com",
            "username": "demo_user",
            "password": "User123!",
            "full_name": "Demo User",
            "role": RoleEnum.STUDENT,
        },
    ]

    for data in demo_users:
        existing = db.query(User).filter(User.email == data["email"]).first()
        if existing:
            continue

        user = User(
            email=data["email"],
            username=data["username"],
            hashed_password=get_password_hash(data["password"]),
            full_name=data["full_name"],
            is_active=True,
        )
        db.add(user)
        db.flush()

        role = db.query(Role).filter(Role.name == data["role"].value).first()
        if role:
            from app.auth.models import UserRole
            db.add(UserRole(user_id=user.id, role_id=role.id))

        logger.info(f"Seeded demo account: {data['email']}")

    db.commit()
