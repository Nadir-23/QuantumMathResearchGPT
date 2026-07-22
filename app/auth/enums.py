"""Centralized RBAC enums — single source of truth for all roles and permissions."""

from enum import Enum


class ResourceEnum(str, Enum):
    USERS = "users"
    ROLES = "roles"
    PERMISSIONS = "permissions"
    PROJECTS = "projects"
    RESEARCH = "research"
    PAPERS = "papers"
    CHAT = "chat"
    AGENTS = "agents"
    MEMORY = "memory"
    KNOWLEDGE_BASE = "knowledge_base"
    DATASETS = "datasets"
    VERIFICATION = "verification"
    MODELS = "models"
    API_KEYS = "api_keys"
    SETTINGS = "settings"
    BILLING = "billing"
    LOGS = "logs"
    ANALYTICS = "analytics"
    UPLOADS = "uploads"
    DOWNLOADS = "downloads"
    NOTIFICATIONS = "notifications"
    ADMIN = "admin"
    MATH = "math"
    QUANTUM = "quantum"
    CODE = "code"
    DOCUMENTS = "documents"


class ActionEnum(str, Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    EXECUTE = "execute"
    CONFIGURE = "configure"
    PUBLISH = "publish"
    QUERY = "query"
    SUBMIT = "submit"
    MANAGE = "manage"
    VIEW = "view"
    RUN = "run"
    VALIDATE = "validate"
    EXPORT = "export"
    IMPORT = "import"
    APPROVE = "approve"
    ASSIGN = "assign"
    MODERATE = "moderate"


class RoleEnum(str, Enum):
    GUEST = "guest"
    STUDENT = "student"
    RESEARCHER = "researcher"
    VERIFIED_RESEARCHER = "verified_researcher"
    PREMIUM_USER = "premium_user"
    MODERATOR = "moderator"
    AGENT_MANAGER = "agent_manager"
    RESEARCH_MANAGER = "research_manager"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


ROLE_HIERARCHY: dict[str, int] = {
    RoleEnum.GUEST: 100,
    RoleEnum.STUDENT: 200,
    RoleEnum.RESEARCHER: 300,
    RoleEnum.VERIFIED_RESEARCHER: 400,
    RoleEnum.PREMIUM_USER: 500,
    RoleEnum.MODERATOR: 600,
    RoleEnum.AGENT_MANAGER: 700,
    RoleEnum.RESEARCH_MANAGER: 800,
    RoleEnum.ADMIN: 900,
    RoleEnum.SUPER_ADMIN: 1000,
}


class PermissionEnum(str, Enum):
    # ── Users ──────────────────────────────────────────────
    USERS_CREATE = "users.create"
    USERS_READ = "users.read"
    USERS_UPDATE = "users.update"
    USERS_DELETE = "users.delete"
    USERS_ASSIGN_ROLE = "users.assign_role"

    # ── Roles ──────────────────────────────────────────────
    ROLES_CREATE = "roles.create"
    ROLES_READ = "roles.read"
    ROLES_UPDATE = "roles.update"
    ROLES_DELETE = "roles.delete"
    ROLES_ASSIGN = "roles.assign"

    # ── Permissions ────────────────────────────────────────
    PERMISSIONS_READ = "permissions.read"
    PERMISSIONS_MANAGE = "permissions.manage"

    # ── Projects ───────────────────────────────────────────
    PROJECTS_CREATE = "projects.create"
    PROJECTS_READ = "projects.read"
    PROJECTS_UPDATE = "projects.update"
    PROJECTS_DELETE = "projects.delete"

    # ── Research ───────────────────────────────────────────
    RESEARCH_SUBMIT = "research.submit"
    RESEARCH_PUBLISH = "research.publish"
    RESEARCH_READ = "research.read"
    RESEARCH_MANAGE = "research.manage"

    # ── Papers ─────────────────────────────────────────────
    PAPERS_READ = "papers.read"
    PAPERS_UPLOAD = "papers.upload"
    PAPERS_DOWNLOAD = "papers.download"
    PAPERS_PUBLISH = "papers.publish"
    PAPERS_DELETE = "papers.delete"

    # ── Chat ───────────────────────────────────────────────
    CHAT_CREATE = "chat.create"
    CHAT_READ = "chat.read"
    CHAT_DELETE = "chat.delete"
    CHAT_MANAGE = "chat.manage"

    # ── Agents ─────────────────────────────────────────────
    AGENTS_EXECUTE = "agents.execute"
    AGENTS_CONFIGURE = "agents.configure"
    AGENTS_CREATE = "agents.create"
    AGENTS_DELETE = "agents.delete"
    AGENTS_VIEW = "agents.view"

    # ── AI Agent Specific ──────────────────────────────────
    MATH_RUN = "math.run"
    MATH_VERIFY = "math.verify"
    QUANTUM_SIMULATE = "quantum.simulate"
    QUANTUM_CIRCUIT = "quantum.circuit"
    RESEARCH_GENERATE = "research.generate"
    CODE_GENERATE = "code.generate"
    CODE_EXECUTE = "code.execute"
    VERIFICATION_VALIDATE = "verification.validate"

    # ── Memory ─────────────────────────────────────────────
    MEMORY_READ = "memory.read"
    MEMORY_WRITE = "memory.write"
    MEMORY_DELETE = "memory.delete"

    # ── Knowledge Base ─────────────────────────────────────
    KNOWLEDGE_BASE_QUERY = "knowledge_base.query"
    KNOWLEDGE_BASE_MANAGE = "knowledge_base.manage"

    # ── Datasets ───────────────────────────────────────────
    DATASETS_READ = "datasets.read"
    DATASETS_CREATE = "datasets.create"
    DATASETS_DELETE = "datasets.delete"
    DATASETS_MANAGE = "datasets.manage"

    # ── Verification ───────────────────────────────────────
    VERIFICATION_RUN = "verification.run"
    VERIFICATION_MANAGE = "verification.manage"

    # ── Models ─────────────────────────────────────────────
    MODELS_READ = "models.read"
    MODELS_CONFIGURE = "models.configure"
    MODELS_MANAGE = "models.manage"

    # ── API Keys ───────────────────────────────────────────
    API_KEYS_CREATE = "api_keys.create"
    API_KEYS_READ = "api_keys.read"
    API_KEYS_REVOKE = "api_keys.revoke"

    # ── Settings ───────────────────────────────────────────
    SETTINGS_READ = "settings.read"
    SETTINGS_UPDATE = "settings.update"

    # ── Billing ────────────────────────────────────────────
    BILLING_READ = "billing.read"
    BILLING_MANAGE = "billing.manage"

    # ── Logs ───────────────────────────────────────────────
    LOGS_READ = "logs.read"
    LOGS_MANAGE = "logs.manage"

    # ── Analytics ──────────────────────────────────────────
    ANALYTICS_VIEW = "analytics.view"
    ANALYTICS_MANAGE = "analytics.manage"

    # ── Uploads / Downloads ────────────────────────────────
    UPLOADS_CREATE = "uploads.create"
    UPLOADS_READ = "uploads.read"
    DOWNLOADS_READ = "downloads.read"

    # ── Notifications ──────────────────────────────────────
    NOTIFICATIONS_READ = "notifications.read"
    NOTIFICATIONS_MANAGE = "notifications.manage"

    # ── Admin ──────────────────────────────────────────────
    ADMIN_DASHBOARD = "admin.dashboard"
    ADMIN_USERS = "admin.users"
    ADMIN_ROLES = "admin.roles"
    ADMIN_SYSTEM = "admin.system"
    ADMIN_DATABASE = "admin.database"
    ADMIN_FEATURES = "admin.features"

    # ── Documents ──────────────────────────────────────────
    DOCUMENTS_READ = "documents.read"
    DOCUMENTS_CREATE = "documents.create"
    DOCUMENTS_UPDATE = "documents.update"
    DOCUMENTS_DELETE = "documents.delete"

    # ── Cross-cutting ──────────────────────────────────────
    EXPORT = "export"
    MODERATE = "moderate"


# ── Role → Permission mappings ────────────────────────────────
# Each role inherits ALL permissions from roles below it.
# This dict only lists NEW permissions added at each level.

ROLE_PERMISSIONS: dict[RoleEnum, list[PermissionEnum]] = {
    RoleEnum.GUEST: [],

    RoleEnum.STUDENT: [
        PermissionEnum.CHAT_CREATE,
        PermissionEnum.CHAT_READ,
        PermissionEnum.MATH_RUN,
        PermissionEnum.QUANTUM_SIMULATE,
        PermissionEnum.QUANTUM_CIRCUIT,
        PermissionEnum.CODE_GENERATE,
        PermissionEnum.PAPERS_READ,
        PermissionEnum.PROJECTS_READ,
        PermissionEnum.MEMORY_READ,
        PermissionEnum.MEMORY_WRITE,
        PermissionEnum.DOCUMENTS_READ,
        PermissionEnum.DOCUMENTS_CREATE,
        PermissionEnum.NOTIFICATIONS_READ,
        PermissionEnum.DOWNLOADS_READ,
    ],

    RoleEnum.RESEARCHER: [
        PermissionEnum.PROJECTS_CREATE,
        PermissionEnum.PROJECTS_UPDATE,
        PermissionEnum.PROJECTS_DELETE,
        PermissionEnum.RESEARCH_SUBMIT,
        PermissionEnum.RESEARCH_READ,
        PermissionEnum.PAPERS_UPLOAD,
        PermissionEnum.PAPERS_DOWNLOAD,
        PermissionEnum.DATASETS_READ,
        PermissionEnum.KNOWLEDGE_BASE_QUERY,
        PermissionEnum.VERIFICATION_RUN,
        PermissionEnum.CODE_EXECUTE,
        PermissionEnum.MATH_VERIFY,
        PermissionEnum.AGENTS_VIEW,
        PermissionEnum.UPLOADS_CREATE,
        PermissionEnum.UPLOADS_READ,
        PermissionEnum.API_KEYS_CREATE,
        PermissionEnum.API_KEYS_READ,
    ],

    RoleEnum.VERIFIED_RESEARCHER: [
        PermissionEnum.RESEARCH_PUBLISH,
        PermissionEnum.PAPERS_PUBLISH,
        PermissionEnum.KNOWLEDGE_BASE_MANAGE,
        PermissionEnum.DATASETS_CREATE,
        PermissionEnum.DOCUMENTS_UPDATE,
        PermissionEnum.DOCUMENTS_DELETE,
    ],

    RoleEnum.PREMIUM_USER: [
        PermissionEnum.AGENTS_EXECUTE,
        PermissionEnum.MEMORY_DELETE,
        PermissionEnum.MODELS_READ,
        PermissionEnum.DATASETS_MANAGE,
        PermissionEnum.ANALYTICS_VIEW,
        PermissionEnum.EXPORT,
    ],

    RoleEnum.MODERATOR: [
        PermissionEnum.CHAT_MANAGE,
        PermissionEnum.CHAT_DELETE,
        PermissionEnum.PAPERS_DELETE,
        PermissionEnum.NOTIFICATIONS_MANAGE,
        PermissionEnum.MODERATE,
    ],

    RoleEnum.AGENT_MANAGER: [
        PermissionEnum.AGENTS_CONFIGURE,
        PermissionEnum.AGENTS_CREATE,
        PermissionEnum.AGENTS_DELETE,
        PermissionEnum.MODELS_CONFIGURE,
        PermissionEnum.MODELS_MANAGE,
        PermissionEnum.VERIFICATION_MANAGE,
    ],

    RoleEnum.RESEARCH_MANAGER: [
        PermissionEnum.RESEARCH_MANAGE,
        PermissionEnum.PROJECTS_READ,  # all projects, not just own
        PermissionEnum.DATASETS_MANAGE,
        PermissionEnum.KNOWLEDGE_BASE_MANAGE,
        PermissionEnum.ANALYTICS_MANAGE,
    ],

    RoleEnum.ADMIN: [
        PermissionEnum.USERS_READ,
        PermissionEnum.USERS_UPDATE,
        PermissionEnum.USERS_DELETE,
        PermissionEnum.USERS_ASSIGN_ROLE,
        PermissionEnum.ROLES_CREATE,
        PermissionEnum.ROLES_READ,
        PermissionEnum.ROLES_UPDATE,
        PermissionEnum.ROLES_DELETE,
        PermissionEnum.ROLES_ASSIGN,
        PermissionEnum.PERMISSIONS_READ,
        PermissionEnum.PERMISSIONS_MANAGE,
        PermissionEnum.ADMIN_DASHBOARD,
        PermissionEnum.ADMIN_USERS,
        PermissionEnum.ADMIN_ROLES,
        PermissionEnum.ADMIN_SYSTEM,
        PermissionEnum.ADMIN_FEATURES,
        PermissionEnum.SETTINGS_READ,
        PermissionEnum.SETTINGS_UPDATE,
        PermissionEnum.LOGS_READ,
        PermissionEnum.LOGS_MANAGE,
        PermissionEnum.API_KEYS_REVOKE,
        PermissionEnum.BILLING_READ,
        PermissionEnum.BILLING_MANAGE,
    ],

    RoleEnum.SUPER_ADMIN: [
        PermissionEnum.ADMIN_DATABASE,
        PermissionEnum.USERS_CREATE,
    ],
}
