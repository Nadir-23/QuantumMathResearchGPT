"""Centralized authorization service — resolves permissions from roles + overrides."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy.orm import Session

from app.auth.enums import (
    ActionEnum,
    PermissionEnum,
    ResourceEnum,
    RoleEnum,
    ROLE_HIERARCHY,
    ROLE_PERMISSIONS,
)

if TYPE_CHECKING:
    from app.models.user import User


class AuthorizationService:
    """Stateless service — all methods take explicit user + db arguments."""

    # ── Permission resolution ────────────────────────────────

    @staticmethod
    def get_effective_permissions(user: "User") -> set[str]:
        """Return the full set of permission strings for a user, combining
        role-based permissions (with hierarchy inheritance) and direct overrides."""
        permissions: set[str] = set()

        # 1. Collect from roles (sorted by level so higher roles override)
        for role in user.roles:
            if not role.is_active:
                continue
            role_enum = RoleEnum(role.name)
            # Walk up the hierarchy — every lower role's permissions are inherited
            for r_enum, level in ROLE_HIERARCHY.items():
                if level <= ROLE_HIERARCHY.get(role_enum, 0):
                    for perm in ROLE_PERMISSIONS.get(r_enum, []):
                        permissions.add(perm.value)

        # 2. Apply direct user-level overrides
        for up in getattr(user, "_direct_perm_overrides", []):
            perm_name = up.permission.name if hasattr(up, "permission") and up.permission else None
            if perm_name:
                if up.granted:
                    permissions.add(perm_name)
                else:
                    permissions.discard(perm_name)

        return permissions

    @staticmethod
    def has_permission(user: "User", permission: str | PermissionEnum) -> bool:
        """Check if user has a specific permission."""
        perm_value = permission.value if isinstance(permission, PermissionEnum) else permission
        return perm_value in AuthorizationService.get_effective_permissions(user)

    @staticmethod
    def has_any_permission(user: "User", *permissions: str | PermissionEnum) -> bool:
        """Check if user has at least one of the given permissions."""
        effective = AuthorizationService.get_effective_permissions(user)
        for perm in permissions:
            perm_value = perm.value if isinstance(perm, PermissionEnum) else perm
            if perm_value in effective:
                return True
        return False

    @staticmethod
    def has_all_permissions(user: "User", *permissions: str | PermissionEnum) -> bool:
        """Check if user has ALL of the given permissions."""
        effective = AuthorizationService.get_effective_permissions(user)
        for perm in permissions:
            perm_value = perm.value if isinstance(perm, PermissionEnum) else perm
            if perm_value not in effective:
                return False
        return True

    # ── Role checks ──────────────────────────────────────────

    @staticmethod
    def has_role(user: "User", role: str | RoleEnum) -> bool:
        role_value = role.value if isinstance(role, RoleEnum) else role
        return any(r.name == role_value for r in user.roles)

    @staticmethod
    def has_any_role(user: "User", *roles: str | RoleEnum) -> bool:
        role_names = {r.value if isinstance(r, RoleEnum) else r for r in roles}
        return any(r.name in role_names for r in user.roles)

    @staticmethod
    def get_highest_role(user: "User") -> RoleEnum | None:
        """Return the user's highest-level role."""
        best: RoleEnum | None = None
        best_level = -1
        for role in user.roles:
            if not role.is_active:
                continue
            try:
                r_enum = RoleEnum(role.name)
                lvl = ROLE_HIERARCHY.get(r_enum, 0)
                if lvl > best_level:
                    best_level = lvl
                    best = r_enum
            except ValueError:
                continue
        return best

    @staticmethod
    def get_role_level(user: "User") -> int:
        """Return the numeric level of the user's highest role."""
        highest = AuthorizationService.get_highest_role(user)
        return ROLE_HIERARCHY.get(highest, 0) if highest else 0

    @staticmethod
    def has_level_at_least(user: "User", level: int) -> bool:
        return AuthorizationService.get_role_level(user) >= level

    # ── Ownership helpers ────────────────────────────────────

    @staticmethod
    def is_owner(user: "User", resource_user_id: int) -> bool:
        return user.id == resource_user_id

    @staticmethod
    def can_access_resource(
        user: "User",
        resource_user_id: int,
        *,
        require_exact_role: RoleEnum | None = None,
        min_level: int = 0,
    ) -> bool:
        """Check if user can access a resource. Owners always can, plus admins."""
        if AuthorizationService.is_owner(user, resource_user_id):
            return True
        if require_exact_role and AuthorizationService.has_role(user, require_exact_role):
            return True
        if AuthorizationService.has_level_at_least(user, min_level):
            return True
        return False

    # ── DB helpers ───────────────────────────────────────────

    @staticmethod
    def load_user_with_rbac(db: Session, user: "User") -> "User":
        """Eagerly load all RBAC relationships on a user instance."""
        from app.auth.models import UserPermission
        from sqlalchemy.orm import joinedload

        loaded = (
            db.query(type(user))
            .options(
                joinedload(type(user).roles),
                joinedload(type(user).direct_permissions),
            )
            .filter(type(user).id == user.id)
            .first()
        )
        if loaded:
            overrides = (
                db.query(UserPermission)
                .filter(UserPermission.user_id == user.id)
                .all()
            )
            loaded._direct_perm_overrides = overrides  # type: ignore[attr-defined]
        return loaded or user
