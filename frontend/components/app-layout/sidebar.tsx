"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import {
  Atom, MessageSquare, Search, Calculator, FlaskConical, Code2,
  ShieldCheck, FileText, BookOpen, Beaker, Database,
  Clock, Settings, Moon, Sun, LogOut, Plus, ChevronLeft, ChevronRight, X,
} from "lucide-react"
import { useState, useEffect } from "react"

const workspaceItems = [
  { icon: MessageSquare, label: "Chat", href: "/app/chat" },
  { icon: Search, label: "Research", href: "/app/research" },
  { icon: Calculator, label: "Mathematics", href: "/app/mathematics" },
  { icon: FlaskConical, label: "Quantum Physics", href: "/app/quantum" },
  { icon: Atom, label: "Quantum Computing", href: "/app/quantum" },
  { icon: Code2, label: "Code Assistant", href: "/app/code" },
  { icon: ShieldCheck, label: "Verification", href: "/app/chat" },
]

const resourceItems = [
  { icon: FileText, label: "Documents", href: "/app/documents" },
  { icon: BookOpen, label: "Notebooks", href: "/app/documents" },
  { icon: Beaker, label: "Simulations", href: "/app/quantum" },
  { icon: Database, label: "Datasets", href: "/app/documents" },
]

interface HistoryItem {
  id: string
  title: string
  time: string
}

const MOCK_HISTORY: HistoryItem[] = [
  { id: "1", title: "Quantum Two-Level System", time: "2m ago" },
  { id: "2", title: "Schrödinger Equation Derivation", time: "1h ago" },
  { id: "3", title: "Bell State Circuit Simulation", time: "3h ago" },
  { id: "4", title: "Fourier Transform Analysis", time: "1d ago" },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed: collapsed, setSidebarCollapsed, theme, toggleTheme, newConversation } = useAppStore()
  const [history] = useState<HistoryItem[]>(MOCK_HISTORY)

  function handleNewChat() {
    newConversation()
    router.push("/app/chat")
    onClose?.()
  }

  function handleNavClick() {
    onClose?.()
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-full flex flex-col border-r border-white/[0.04] bg-[#0C1528]/95 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-white/[0.04]">
          {!collapsed ? (
            <Link href="/" className="flex items-center gap-2.5" onClick={handleNavClick}>
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Atom className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white leading-tight">Quantum<span className="text-blue-400">Math</span></span>
                <span className="text-[9px] text-white/30 leading-tight">ResearchGPT</span>
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <Atom className="w-4 h-4 text-white" />
            </div>
          )}
          {!collapsed ? (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all hidden md:block"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <div className="px-3 pt-3 pb-1">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewChat}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-all",
              "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            )}
          >
            <Plus className="w-4 h-4" />
            {!collapsed && <span>New Chat</span>}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-2 space-y-4 overflow-y-auto">
          {/* Workspace Section */}
          <div>
            {!collapsed && (
              <div className="px-3 py-1.5 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
                Workspace
              </div>
            )}
            <div className="space-y-0.5">
              {workspaceItems.map((item) => {
                const isActive = pathname === item.href
                const btn = (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "sidebar-item",
                      isActive && "active"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
                return collapsed ? (
                  <Tooltip key={item.href + item.label}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-[#111827] border-white/[0.06]">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={item.href + item.label}>{btn}</div>
                )
              })}
            </div>
          </div>

          {/* Resources Section */}
          <div>
            {!collapsed && (
              <div className="px-3 py-1.5 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
                Resources
              </div>
            )}
            <div className="space-y-0.5">
              {resourceItems.map((item) => {
                const isActive = pathname === item.href
                const btn = (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "sidebar-item",
                      isActive && "active"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
                return collapsed ? (
                  <Tooltip key={item.href + item.label}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-[#111827] border-white/[0.06]">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={item.href + item.label}>{btn}</div>
                )
              })}
            </div>
          </div>

          {/* History Section */}
          {!collapsed && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-white/25 uppercase tracking-widest flex items-center justify-between">
                <span>History</span>
                <Clock className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                {history.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { router.push("/app/chat"); handleNavClick() }}
                    className="w-full sidebar-item group"
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0 text-white/20 group-hover:text-white/40" />
                    <span className="truncate text-left">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/[0.04] space-y-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Profile Card */}
          <div className={cn(
            "flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]",
            collapsed && "justify-center"
          )}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                N
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-medium text-white/80 truncate">Nadir</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] text-white/30 truncate">nadir@example.com</div>
              </div>
            )}
            {!collapsed && (
              <button className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
