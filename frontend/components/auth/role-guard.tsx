"use client"

import { type ReactNode } from "react"
import { useRBAC } from "@/components/auth/rbac-provider"

interface RoleGuardProps {
  roles: string[]
  requireAll?: boolean
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Renders children only if the user has the required role(s).
 *
 * Usage:
 *   <RoleGuard roles={["admin", "super_admin"]} fallback={<AccessDenied />}>
 *     <AdminPanel />
 *   </RoleGuard>
 */
export function RoleGuard({ roles, requireAll = false, fallback = null, children }: RoleGuardProps) {
  const { hasAnyRole, hasRole } = useRBAC()

  const allowed = requireAll
    ? roles.every((r) => hasRole(r))
    : hasAnyRole(...roles)

  return allowed ? <>{children}</> : <>{fallback}</>
}
