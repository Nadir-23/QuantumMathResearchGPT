"""Policy engine for ownership-based and resource-level access control."""

from __future__ import annotations

from typing import Any, Callable

from app.auth.enums import PermissionEnum, RoleEnum, ROLE_HIERARCHY
from app.auth.service import AuthorizationService
from app.models.user import User


class PolicyContext:
    """Carries the resource and its metadata for policy evaluation."""

    def __init__(
        self,
        user: User,
        resource: Any = None,
        resource_type: str = "",
        action: str = "",
    ) -> None:
        self.user = user
        self.resource = resource
        self.resource_type = resource_type
        self.action = action
        self._service = AuthorizationService()

    @property
    def resource_owner_id(self) -> int | None:
        if self.resource is None:
            return None
        for attr in ("user_id", "owner_id", "created_by"):
            val = getattr(self.resource, attr, None)
            if val is not None:
                return int(val)
        return None


class Policy:
    """Base policy class. Override `evaluate` to implement custom logic."""

    def evaluate(self, ctx: PolicyContext) -> bool:
        raise NotImplementedError


class OwnerOrAdminPolicy(Policy):
    """The resource owner OR any admin-level user can access."""

    def __init__(self, min_admin_level: int = ROLE_HIERARCHY[RoleEnum.ADMIN] // 100 * 100) -> None:
        self.min_level = min_admin_level

    def evaluate(self, ctx: PolicyContext) -> bool:
        if ctx.resource_owner_id is not None:
            if ctx.user.id == ctx.resource_owner_id:
                return True
        return ctx._service.has_level_at_least(ctx.user, self.min_level)


class RoleBasedPolicy(Policy):
    """Require a specific role to access."""

    def __init__(self, *roles: RoleEnum | str) -> None:
        self.roles = roles

    def evaluate(self, ctx: PolicyContext) -> bool:
        return ctx._service.has_any_role(ctx.user, *self.roles)


class PermissionBasedPolicy(Policy):
    """Require a specific permission to access."""

    def __init__(self, *perms: PermissionEnum | str) -> None:
        self.perms = perms

    def evaluate(self, ctx: PolicyContext) -> bool:
        return ctx._service.has_all_permissions(ctx.user, *self.perms)


class OwnerOrPermissionPolicy(Policy):
    """Owner can always access; otherwise require a specific permission."""

    def __init__(self, permission: PermissionEnum | str) -> None:
        self.permission = permission

    def evaluate(self, ctx: PolicyContext) -> bool:
        if ctx.resource_owner_id is not None and ctx.user.id == ctx.resource_owner_id:
            return True
        return ctx._service.has_permission(ctx.user, self.permission)


class PolicyEngine:
    """Evaluates a chain of policies — first match wins."""

    @staticmethod
    def evaluate(ctx: PolicyContext, *policies: Policy) -> bool:
        for policy in policies:
            if policy.evaluate(ctx):
                return True
        return False

    # ── Pre-built common policies ────────────────────────────

    @staticmethod
    def owner_or_admin(resource: Any = None, **kwargs: Any) -> PolicyContext:
        return PolicyContext(resource=resource, **kwargs)

    @staticmethod
    def chat_access(user: User, chat: Any) -> bool:
        ctx = PolicyContext(user=user, resource=chat, resource_type="chat")
        return PolicyEngine.evaluate(ctx, OwnerOrAdminPolicy())

    @staticmethod
    def project_access(user: User, project: Any) -> bool:
        ctx = PolicyContext(user=user, resource=project, resource_type="project")
        return PolicyEngine.evaluate(ctx, OwnerOrAdminPolicy())

    @staticmethod
    def paper_access(user: User, paper: Any) -> bool:
        ctx = PolicyContext(user=user, resource=paper, resource_type="paper")
        return PolicyEngine.evaluate(ctx, OwnerOrAdminPolicy())

    @staticmethod
    def admin_only(user: User) -> bool:
        return AuthorizationService.has_level_at_least(user, ROLE_HIERARCHY[RoleEnum.ADMIN])
