"use client"

import { useRBAC } from "@/components/auth/rbac-provider"

/** Check if the current user has a specific role. */
export function useRole(role: string): boolean {
  const { hasRole } = useRBAC()
  return hasRole(role)
}

/** Check if the current user has at least one of the given roles. */
export function useAnyRole(...roles: string[]): boolean {
  const { hasAnyRole } = useRBAC()
  return hasAnyRole(...roles)
}

/** Get the user's highest role name and level. */
export function useHighestRole() {
  const { highestRole, roleLevel } = useRBAC()
  return { highestRole, roleLevel }
}
