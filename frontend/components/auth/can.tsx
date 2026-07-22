"use client"

import { type ReactNode } from "react"
import { useCan } from "@/hooks/use-can"

interface CanProps {
  permission?: string
  role?: string
  anyRole?: string[]
  anyPermission?: string[]
  allPermissions?: string[]
  minLevel?: number
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Declarative permission gate component.
 *
 * Usage:
 *   <Can permission="admin.dashboard" fallback={<p>Access denied</p>}>
 *     <AdminPanel />
 *   </Can>
 *
 *   <Can role="admin">
 *     <DeleteButton />
 *   </Can>
 */
export function Can({
  permission,
  role,
  anyRole,
  anyPermission,
  allPermissions,
  minLevel,
  fallback = null,
  children,
}: CanProps) {
  const allowed = useCan({ permission, role, anyRole, anyPermission, allPermissions, minLevel })
  return allowed ? <>{children}</> : <>{fallback}</>
}
