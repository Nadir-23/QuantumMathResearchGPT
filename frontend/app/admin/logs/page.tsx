"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { FileText, Filter } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface AuditEntry {
  id: number
  user_id: number | null
  action: string
  resource: string
  resource_id: string | null
  status_code: number | null
  ip_address: string | null
  created_at: string | null
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState("")
  const [resourceFilter, setResourceFilter] = useState("")
  const accessToken = useAuthStore((s) => s.accessToken)

  const fetchLogs = () => {
    if (!accessToken) return
    const params = new URLSearchParams({ limit: "200" })
    if (actionFilter) params.set("action", actionFilter)
    if (resourceFilter) params.set("resource", resourceFilter)
    fetch(`${API_URL}/admin/logs?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then(setLogs)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchLogs() }, [accessToken])

  if (loading) return <div className="p-6 text-white/40">Loading audit logs...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Audit Logs</h1>

      <div className="flex gap-3">
        <input
          placeholder="Filter by action..."
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white/80 placeholder:text-white/20"
        />
        <input
          placeholder="Filter by resource..."
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white/80 placeholder:text-white/20"
        />
        <button onClick={fetchLogs} className="px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-xl text-sm hover:bg-blue-600/30 transition-all">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left px-4 py-3 text-white/40 font-medium">Time</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">User</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Action</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Resource</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-2 text-xs text-white/30">
                  {log.created_at ? new Date(log.created_at).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-2 text-white/60">{log.user_id ?? "-"}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-medium ${
                    log.action === "get" ? "bg-blue-500/10 text-blue-400" :
                    log.action === "post" ? "bg-emerald-500/10 text-emerald-400" :
                    log.action === "put" || log.action === "patch" ? "bg-amber-500/10 text-amber-400" :
                    log.action === "delete" ? "bg-red-500/10 text-red-400" :
                    "bg-white/5 text-white/40"
                  }`}>
                    {log.action.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2 text-white/60">
                  /{log.resource}{log.resource_id ? `/${log.resource_id}` : ""}
                </td>
                <td className="px-4 py-2">
                  {log.status_code && (
                    <span className={`text-xs ${log.status_code < 400 ? "text-emerald-400" : "text-red-400"}`}>
                      {log.status_code}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs text-white/30">{log.ip_address ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
