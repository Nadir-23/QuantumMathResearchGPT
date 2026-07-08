"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAppStore, AgentName } from "@/lib/store"
import { Brain, Calculator, Atom, Search, Code2, ShieldCheck, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const agentConfig: Record<AgentName, { icon: React.ElementType; color: string; glowColor: string }> = {
  "Orchestrator": { icon: Brain, color: "text-blue-400", glowColor: "shadow-blue-500/30" },
  "Math Agent": { icon: Calculator, color: "text-purple-400", glowColor: "shadow-purple-500/30" },
  "Quantum Agent": { icon: Atom, color: "text-cyan-400", glowColor: "shadow-cyan-500/30" },
  "Research Agent": { icon: Search, color: "text-emerald-400", glowColor: "shadow-emerald-500/30" },
  "Code Agent": { icon: Code2, color: "text-amber-400", glowColor: "shadow-amber-500/30" },
  "Verification Agent": { icon: ShieldCheck, color: "text-rose-400", glowColor: "shadow-rose-500/30" },
}

export default function ActiveAgentBar() {
  const { currentAgent, streaming } = useAppStore()

  if (!currentAgent && !streaming) return null

  const agents: AgentName[] = ["Orchestrator", "Math Agent", "Quantum Agent", "Research Agent", "Code Agent", "Verification Agent"]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04] bg-white/[0.01]"
      >
        {agents.map((name) => {
          const config = agentConfig[name]
          const Icon = config.icon
          const isActive = currentAgent === name

          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border",
                isActive
                  ? `bg-white/[0.06] border-white/[0.1] ${config.color} shadow-lg ${config.glowColor}`
                  : "bg-white/[0.02] border-white/[0.04] text-white/30"
              )}
            >
              {isActive && streaming ? (
                <Loader2 className={cn("w-3 h-3 animate-spin", config.color)} />
              ) : (
                <Icon className={cn("w-3 h-3", isActive ? config.color : "text-white/20")} />
              )}
              <span className="hidden sm:inline">{name}</span>
              {isActive && (
                <motion.div
                  className={cn("w-1.5 h-1.5 rounded-full", {
                    "bg-blue-400": name === "Orchestrator",
                    "bg-purple-400": name === "Math Agent",
                    "bg-cyan-400": name === "Quantum Agent",
                    "bg-emerald-400": name === "Research Agent",
                    "bg-amber-400": name === "Code Agent",
                    "bg-rose-400": name === "Verification Agent",
                  })}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
