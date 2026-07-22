"use client"

import { useRBAC } from "@/components/auth/rbac-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Shield, Users, Key, Activity, Settings, Database, FileText } from "lucide-react"

const ADMIN_SECTIONS = [
  { title: "Dashboard", href: "/admin", icon: Activity, permission: "admin.dashboard" },
  { title: "User Management", href: "/admin/users", icon: Users, permission: "admin.users" },
  { title: "Role Management", href: "/admin/roles", icon: Shield, permission: "admin.roles" },
  { title: "Audit Logs", href: "/admin/logs", icon: FileText, permission: "logs.read" },
  { title: "System Settings", href: "/admin/settings", icon: Settings, permission: "admin.system" },
  { title: "API Keys", href: "/admin/api-keys", icon: Key, permission: "api_keys.read" },
  { title: "Database", href: "/admin/database", icon: Database, permission: "admin.database" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, hasPermission } = useRBAC()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push("/app/chat")
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500/50 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-white/40">You need administrator privileges to access this area.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 p-6">
      <nav className="w-56 shrink-0 space-y-1">
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3 px-3">Administration</h3>
        {ADMIN_SECTIONS.filter((s) => hasPermission(s.permission)).map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all"
          >
            <section.icon className="w-4 h-4" />
            {section.title}
          </Link>
        ))}
      </nav>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
