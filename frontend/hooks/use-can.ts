"use client"

import { useRBAC } from "@/components/auth/rbac-provider"

/**
 * Unified "can I do this?" hook.
 *
 * Usage:
 *   const canChat = useCan({ permission: "chat.create" })
 *   const isAdmin = useCan({ role: "admin" })
 *   const canManage = useCan({ minLevel: 900 })
 */
interface CanOptions {
  permission?: string
  role?: string
  anyRole?: string[]
  anyPermission?: string[]
  allPermissions?: string[]
  minLevel?: number
}

export function useCan(opts: CanOptions): boolean {
  const rbac = useRBAC()

  if (opts.permission) return rbac.hasPermission(opts.permission)
  if (opts.role) return rbac.hasRole(opts.role)
  if (opts.anyRole) return rbac.hasAnyRole(...opts.anyRole)
  if (opts.anyPermission) return rbac.hasAnyPermission(...opts.anyPermission)
  if (opts.allPermissions) return rbac.hasAllPermissions(...opts.allPermissions)
  if (opts.minLevel !== undefined) return rbac.hasLevel(opts.minLevel)

  return false
}
