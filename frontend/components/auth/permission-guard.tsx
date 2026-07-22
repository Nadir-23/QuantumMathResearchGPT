"use client"

import { type ReactNode } from "react"
import { useRBAC } from "@/components/auth/rbac-provider"

interface PermissionGuardProps {
  permissions: string[]
  requireAll?: boolean
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Renders children only if the user has the required permission(s).
 *
 * Usage:
 *   <PermissionGuard permissions={["admin.dashboard"]}>
 *     <AdminDashboard />
 *   </PermissionGuard>
 */
export function PermissionGuard({ permissions, requireAll = true, fallback = null, children }: PermissionGuardProps) {
  const { hasAllPermissions, hasAnyPermission } = useRBAC()

  const allowed = requireAll
    ? hasAllPermissions(...permissions)
    : hasAnyPermission(...permissions)

  return allowed ? <>{children}</> : <>{fallback}</>
}
