"use client"

import { useAppStore } from "@/lib/store"
import Sidebar from "@/components/app-layout/sidebar"
import Topbar from "@/components/app-layout/topbar"
import RightPanel from "@/components/app-layout/right-panel"
import { AuthProvider } from "@/components/auth-provider"
import { RBACProvider } from "@/components/auth/rbac-provider"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, rightPanelOpen, theme } = useAppStore()
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "dark" : ""
  }, [theme])

  return (
    <AuthProvider>
      <RBACProvider>
      <div className="min-h-screen bg-[#08111F] flex">
        {/* Mobile overlay */}
        {isMobile && mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        {isMobile ? (
          <div className={cn(
            "fixed z-40 transition-transform duration-300",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        ) : (
          <Sidebar />
        )}

        <div className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          !isMobile && (sidebarCollapsed ? "ml-[60px]" : "ml-[240px]")
        )}>
          <Topbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} isMobile={isMobile} />
          <div className="flex-1 flex min-h-0">
            <main className="flex-1 overflow-y-auto">{children}</main>
            {!isMobile && rightPanelOpen && <RightPanel />}
          </div>
        </div>
      </div>
      </RBACProvider>
    </AuthProvider>
  )
}
