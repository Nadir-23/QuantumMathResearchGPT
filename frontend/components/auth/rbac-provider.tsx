"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { hasLevel, hasAnyRole, hasAllPermissions, hasAnyPermission, ROLE_LEVELS, type RoleName } from "@/lib/rbac"

interface RBACContextValue {
  roles: string[]
  permissions: string[]
  hasRole: (role: string) => boolean
  hasAnyRole: (...roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  hasAllPermissions: (...permissions: string[]) => boolean
  hasAnyPermission: (...permissions: string[]) => boolean
  hasLevel: (minLevel: number) => boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  highestRole: string | null
  roleLevel: number
}

const RBACContext = createContext<RBACContextValue | null>(null)

export function RBACProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)

  const value = useMemo<RBACContextValue>(() => {
    const roles = user?.roles ?? []
    const permissions = user?.permissions ?? []

    const highestRole = roles.reduce<string | null>((best, roleName) => {
      const level = ROLE_LEVELS[roleName as RoleName] ?? 0
      const bestLevel = best ? ROLE_LEVELS[best as RoleName] ?? 0 : 0
      return level > bestLevel ? roleName : best
    }, null)

    const roleLevel = highestRole ? ROLE_LEVELS[highestRole as RoleName] ?? 0 : 0

    return {
      roles,
      permissions,
      hasRole: (role: string) => roles.includes(role),
      hasAnyRole: (...rs: string[]) => hasAnyRole(roles, ...rs),
      hasPermission: (perm: string) => permissions.includes(perm),
      hasAllPermissions: (...perms: string[]) => hasAllPermissions(permissions, ...perms),
      hasAnyPermission: (...perms: string[]) => hasAnyPermission(permissions, ...perms),
      hasLevel: (min: number) => hasLevel(roles, min),
      isAdmin: roles.includes("admin") || roles.includes("super_admin"),
      isSuperAdmin: roles.includes("super_admin"),
      highestRole,
      roleLevel,
    }
  }, [user])

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>
}

export function useRBAC(): RBACContextValue {
  const ctx = useContext(RBACContext)
  if (!ctx) {
    return {
      roles: [],
      permissions: [],
      hasRole: () => false,
      hasAnyRole: () => false,
      hasPermission: () => false,
      hasAllPermissions: () => false,
      hasAnyPermission: () => false,
      hasLevel: () => false,
      isAdmin: false,
      isSuperAdmin: false,
      highestRole: null,
      roleLevel: 0,
    }
  }
  return ctx
}
