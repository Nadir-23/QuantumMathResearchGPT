/** Frontend RBAC types and constants — mirrors backend enums. */

export const ROLES = {
  GUEST: "guest",
  STUDENT: "student",
  RESEARCHER: "researcher",
  VERIFIED_RESEARCHER: "verified_researcher",
  PREMIUM_USER: "premium_user",
  MODERATOR: "moderator",
  AGENT_MANAGER: "agent_manager",
  RESEARCH_MANAGER: "research_manager",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const

export type RoleName = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LEVELS: Record<RoleName, number> = {
  guest: 100,
  student: 200,
  researcher: 300,
  verified_researcher: 400,
  premium_user: 500,
  moderator: 600,
  agent_manager: 700,
  research_manager: 800,
  admin: 900,
  super_admin: 1000,
}

export const ROLE_DISPLAY_NAMES: Record<RoleName, string> = {
  guest: "Guest",
  student: "Student",
  researcher: "Researcher",
  verified_researcher: "Verified Researcher",
  premium_user: "Premium User",
  moderator: "Moderator",
  agent_manager: "Agent Manager",
  research_manager: "Research Manager",
  admin: "Administrator",
  super_admin: "Super Administrator",
}

export const PERMISSIONS = {
  // Users
  USERS_CREATE: "users.create",
  USERS_READ: "users.read",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  USERS_ASSIGN_ROLE: "users.assign_role",

  // Roles
  ROLES_CREATE: "roles.create",
  ROLES_READ: "roles.read",
  ROLES_UPDATE: "roles.update",
  ROLES_DELETE: "roles.delete",
  ROLES_ASSIGN: "roles.assign",

  // Permissions
  PERMISSIONS_READ: "permissions.read",
  PERMISSIONS_MANAGE: "permissions.manage",

  // Projects
  PROJECTS_CREATE: "projects.create",
  PROJECTS_READ: "projects.read",
  PROJECTS_UPDATE: "projects.update",
  PROJECTS_DELETE: "projects.delete",

  // Research
  RESEARCH_SUBMIT: "research.submit",
  RESEARCH_PUBLISH: "research.publish",
  RESEARCH_READ: "research.read",
  RESEARCH_MANAGE: "research.manage",

  // Papers
  PAPERS_READ: "papers.read",
  PAPERS_UPLOAD: "papers.upload",
  PAPERS_DOWNLOAD: "papers.download",
  PAPERS_PUBLISH: "papers.publish",
  PAPERS_DELETE: "papers.delete",

  // Chat
  CHAT_CREATE: "chat.create",
  CHAT_READ: "chat.read",
  CHAT_DELETE: "chat.delete",
  CHAT_MANAGE: "chat.manage",

  // Agents
  AGENTS_EXECUTE: "agents.execute",
  AGENTS_CONFIGURE: "agents.configure",
  AGENTS_CREATE: "agents.create",
  AGENTS_DELETE: "agents.delete",
  AGENTS_VIEW: "agents.view",

  // AI Agent Specific
  MATH_RUN: "math.run",
  MATH_VERIFY: "math.verify",
  QUANTUM_SIMULATE: "quantum.simulate",
  QUANTUM_CIRCUIT: "quantum.circuit",
  RESEARCH_GENERATE: "research.generate",
  CODE_GENERATE: "code.generate",
  CODE_EXECUTE: "code.execute",
  VERIFICATION_VALIDATE: "verification.validate",

  // Memory
  MEMORY_READ: "memory.read",
  MEMORY_WRITE: "memory.write",
  MEMORY_DELETE: "memory.delete",

  // Knowledge Base
  KNOWLEDGE_BASE_QUERY: "knowledge_base.query",
  KNOWLEDGE_BASE_MANAGE: "knowledge_base.manage",

  // Datasets
  DATASETS_READ: "datasets.read",
  DATASETS_CREATE: "datasets.create",
  DATASETS_DELETE: "datasets.delete",
  DATASETS_MANAGE: "datasets.manage",

  // Verification
  VERIFICATION_RUN: "verification.run",
  VERIFICATION_MANAGE: "verification.manage",

  // Models
  MODELS_READ: "models.read",
  MODELS_CONFIGURE: "models.configure",
  MODELS_MANAGE: "models.manage",

  // API Keys
  API_KEYS_CREATE: "api_keys.create",
  API_KEYS_READ: "api_keys.read",
  API_KEYS_REVOKE: "api_keys.revoke",

  // Settings
  SETTINGS_READ: "settings.read",
  SETTINGS_UPDATE: "settings.update",

  // Billing
  BILLING_READ: "billing.read",
  BILLING_MANAGE: "billing.manage",

  // Logs
  LOGS_READ: "logs.read",
  LOGS_MANAGE: "logs.manage",

  // Analytics
  ANALYTICS_VIEW: "analytics.view",
  ANALYTICS_MANAGE: "analytics.manage",

  // Uploads / Downloads
  UPLOADS_CREATE: "uploads.create",
  UPLOADS_READ: "uploads.read",
  DOWNLOADS_READ: "downloads.read",

  // Notifications
  NOTIFICATIONS_READ: "notifications.read",
  NOTIFICATIONS_MANAGE: "notifications.manage",

  // Admin
  ADMIN_DASHBOARD: "admin.dashboard",
  ADMIN_USERS: "admin.users",
  ADMIN_ROLES: "admin.roles",
  ADMIN_SYSTEM: "admin.system",
  ADMIN_DATABASE: "admin.database",
  ADMIN_FEATURES: "admin.features",

  // Documents
  DOCUMENTS_READ: "documents.read",
  DOCUMENTS_CREATE: "documents.create",
  DOCUMENTS_UPDATE: "documents.update",
  DOCUMENTS_DELETE: "documents.delete",

  // Cross-cutting
  EXPORT: "export",
  MODERATE: "moderate",
} as const

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/** Check if a user's role level meets a minimum threshold. */
export function hasLevel(userRoles: string[], minLevel: number): boolean {
  const highest = userRoles.reduce((max, roleName) => {
    const level = ROLE_LEVELS[roleName as RoleName] ?? 0
    return level > max ? level : max
  }, 0)
  return highest >= minLevel
}

/** Check if user has at least one of the given roles. */
export function hasAnyRole(userRoles: string[], ...roles: string[]): boolean {
  return roles.some((r) => userRoles.includes(r))
}

/** Check if user has ALL of the given permissions. */
export function hasAllPermissions(userPerms: string[], ...perms: string[]): boolean {
  return perms.every((p) => userPerms.includes(p))
}

/** Check if user has at least one of the given permissions. */
export function hasAnyPermission(userPerms: string[], ...perms: string[]): boolean {
  return perms.some((p) => userPerms.includes(p))
}
