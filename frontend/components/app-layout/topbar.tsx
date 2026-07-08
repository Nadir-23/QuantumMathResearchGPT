"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PanelRightOpen, PanelRightClose, Share2, Settings, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const models = [
  { value: "Gemini 2.5 Flash", label: "Gemini 2.5 Flash" },
  { value: "Claude 4", label: "Claude 4" },
  { value: "GPT-5", label: "GPT-5" },
  { value: "Gemini 2.5 Pro", label: "Gemini 2.5 Pro" },
]

interface TopbarProps {
  onMenuToggle?: () => void
  isMobile?: boolean
}

export default function Topbar({ onMenuToggle, isMobile }: TopbarProps) {
  const { rightPanelOpen, setRightPanelOpen, selectedModel, setSelectedModel, messages } = useAppStore()
  const router = useRouter()

  const lastUserMsg = [...messages].reverse().find(m => m.role === "user")
  const title = lastUserMsg ? lastUserMsg.text.slice(0, 50) + (lastUserMsg.text.length > 50 ? "..." : "") : "New Conversation"

  return (
    <header className="h-14 border-b border-white/[0.04] bg-[#08111F]/80 backdrop-blur-xl flex items-center justify-between px-4 z-30">
      {/* Left: Menu / Model Selector */}
      <div className="flex items-center gap-3 min-w-0">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/40 hover:text-white/70"
            onClick={onMenuToggle}
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
        {!isMobile && (
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[160px] h-8 text-[12px] bg-white/[0.03] border-white/[0.06]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-[12px]">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Center: Title */}
      <div className="flex-1 flex justify-center min-w-0 px-4">
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[13px] font-medium text-white/60 truncate max-w-[300px] md:max-w-[400px]"
        >
          {title}
        </motion.h1>
      </div>

      {/* Right: Status + Actions */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* System Status - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] text-white/40">All Systems Operational</span>
        </div>

        {/* Share */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white/70">
          <Share2 className="w-4 h-4" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/40 hover:text-white/70"
          onClick={() => router.push("/app/settings")}
        >
          <Settings className="w-4 h-4" />
        </Button>

        {/* Panel Toggle - hidden on mobile */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/40 hover:text-white/70"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
          >
            {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </header>
  )
}
