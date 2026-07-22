"use client"

import { useRBAC } from "@/components/auth/rbac-provider"

/** Check if the current user has a specific permission. */
export function usePermission(permission: string): boolean {
  const { hasPermission } = useRBAC()
  return hasPermission(permission)
}

/** Check if the current user has ALL of the given permissions. */
export function useAllPermissions(...permissions: string[]): boolean {
  const { hasAllPermissions } = useRBAC()
  return hasAllPermissions(...permissions)
}

/** Check if the current user has at least one of the given permissions. */
export function useAnyPermission(...permissions: string[]): boolean {
  const { hasAnyPermission } = useRBAC()
  return hasAnyPermission(...permissions)
}
