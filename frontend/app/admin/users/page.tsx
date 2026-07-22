"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Shield, UserCheck, UserX, ChevronDown } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface AdminUser {
  id: number
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  is_superuser: boolean
  roles: string[]
}

const ALL_ROLES = [
  "student", "researcher", "verified_researcher", "premium_user",
  "moderator", "agent_manager", "research_manager", "admin", "super_admin",
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const accessToken = useAuthStore((s) => s.accessToken)

  const fetchUsers = () => {
    if (!accessToken) return
    fetch(`${API_URL}/admin/users?limit=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchUsers() }, [accessToken])

  const assignRole = async (userId: number, roleName: string) => {
    if (!accessToken) return
    await fetch(`${API_URL}/admin/users/${userId}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ user_id: userId, role_name: roleName }),
    })
    fetchUsers()
  }

  const removeRole = async (userId: number, roleName: string) => {
    if (!accessToken) return
    await fetch(`${API_URL}/admin/users/${userId}/roles/${roleName}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    fetchUsers()
  }

  const toggleActive = async (userId: number, isActive: boolean) => {
    if (!accessToken) return
    await fetch(`${API_URL}/admin/users/${userId}/active?is_active=${isActive}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    fetchUsers()
  }

  if (loading) return <div className="p-6 text-white/40">Loading users...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">User Management</h1>

      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left px-4 py-3 text-white/40 font-medium">User</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Roles</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Status</th>
              <th className="text-right px-4 py-3 text-white/40 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="text-white font-medium">{u.username}</div>
                  <div className="text-xs text-white/30">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r) => (
                      <span key={r} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs">
                        {r}
                        <button onClick={() => removeRole(u.id, r)} className="hover:text-red-400">&times;</button>
                      </span>
                    ))}
                    <select
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-xs text-white/60"
                      value=""
                      onChange={(e) => { if (e.target.value) assignRole(u.id, e.target.value) }}
                    >
                      <option value="">+ Add role</option>
                      {ALL_ROLES.filter((r) => !u.roles.includes(r)).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {u.is_active ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs"><UserCheck className="w-3 h-3" /> Active</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 text-xs"><UserX className="w-3 h-3" /> Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleActive(u.id, !u.is_active)}
                    className={`text-xs px-3 py-1 rounded-lg transition-all ${u.is_active ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"}`}
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
