"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Users, Shield, Activity, FileText, BarChart3 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Stats {
  total_users: number
  active_users: number
  total_roles: number
  total_permissions: number
  total_audit_logs: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState("")
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return
    fetch(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setStats)
      .catch(() => setError("Failed to load admin stats"))
  }, [accessToken])

  if (error) return <div className="p-6 text-red-400">{error}</div>
  if (!stats) return <div className="p-6 text-white/40">Loading...</div>

  const cards = [
    { label: "Total Users", value: stats.total_users, icon: Users, color: "text-blue-400" },
    { label: "Active Users", value: stats.active_users, icon: Activity, color: "text-emerald-400" },
    { label: "Roles", value: stats.total_roles, icon: Shield, color: "text-purple-400" },
    { label: "Permission Overrides", value: stats.total_permissions, icon: BarChart3, color: "text-amber-400" },
    { label: "Audit Log Entries", value: stats.total_audit_logs, icon: FileText, color: "text-rose-400" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-[#111827]/60 border border-white/[0.06] p-5">
            <div className="flex items-center gap-3 mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-sm text-white/50">{card.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{card.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
