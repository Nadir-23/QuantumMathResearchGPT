"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Shield, Lock } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface AdminRole {
  id: number
  name: string
  display_name: string
  description: string | null
  level: number
  is_system: boolean
  permission_count: number
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([])
  const [loading, setLoading] = useState(true)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return
    fetch(`${API_URL}/admin/roles`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then(setRoles)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [accessToken])

  if (loading) return <div className="p-6 text-white/40">Loading roles...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Role Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="rounded-2xl bg-[#111827]/60 border border-white/[0.06] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-white font-semibold">{role.display_name}</div>
                <div className="text-xs text-white/30">@{role.name}</div>
              </div>
              {role.is_system && (
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs">
                  <Lock className="w-3 h-3" /> System
                </span>
              )}
            </div>
            {role.description && <p className="text-xs text-white/40 mb-3">{role.description}</p>}
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span>Level: {role.level}</span>
              <span>{role.permission_count} permissions</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
