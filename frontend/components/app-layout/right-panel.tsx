"use client"

import { useAppStore } from "@/lib/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Cpu, Zap, FileText, Clock, Activity, Hash, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const pipelineSteps = [
  { label: "User Query", color: "text-white/50" },
  { label: "Orchestrator", color: "text-blue-400" },
  { label: "Quantum Agent", color: "text-cyan-400" },
  { label: "Math Agent", color: "text-purple-400" },
  { label: "Code Agent", color: "text-amber-400" },
  { label: "Verification Agent", color: "text-rose-400" },
  { label: "Final Answer", color: "text-emerald-400" },
]

const recentPapers = [
  { title: "Variational Quantum Eigensolver", authors: "Peruzzo et al.", year: "2014", journal: "Nature Communications" },
  { title: "Quantum Error Correction", authors: "Gottesman", year: "1997", journal: "arXiv" },
  { title: "Shor's Algorithm", authors: "Shor", year: "1994", journal: "SIAM Review" },
]

export default function RightPanel() {
  const { messages, streaming, currentAgent, selectedModel } = useAppStore()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    session: true,
    pipeline: true,
    papers: false,
  })

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const tokenCount = messages.reduce((acc, m) => acc + (m.text?.length || 0), 0)
  const lastAgent = currentAgent || (messages.length > 0 ? messages[messages.length - 1].agent : null)

  return (
    <aside className="w-[280px] border-l border-white/[0.04] bg-[#0C1528]/95 backdrop-blur-xl flex flex-col overflow-y-auto">
      {/* Active Session */}
      <div className="p-4 border-b border-white/[0.04]">
        <button
          onClick={() => toggleSection("session")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Active Session</h3>
          {expandedSections.session ? (
            <ChevronUp className="w-3 h-3 text-white/30" />
          ) : (
            <ChevronDown className="w-3 h-3 text-white/30" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.session && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <div className="flex items-center gap-2 text-[12px]">
                <Brain className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white/40">Current Agent</span>
                <span className="ml-auto text-white/60 font-mono text-[11px]">{lastAgent || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-white/40">Model</span>
                <span className="ml-auto text-white/60 font-mono text-[11px]">{selectedModel}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white/40">Tools</span>
                <span className="ml-auto text-white/60 font-mono text-[11px]">Wolfram, ArXiv</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white/40">Session</span>
                <span className="ml-auto text-white/60 font-mono text-[11px]">Active</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Memory */}
      <div className="p-4 border-b border-white/[0.04]">
        <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Memory</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[12px]">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-white/40">Context</span>
            <span className="ml-auto text-white/60 font-mono text-[11px]">{Math.round(tokenCount / 4)} tokens</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-white/40">Files</span>
            <span className="ml-auto text-white/60 font-mono text-[11px]">0 loaded</span>
          </div>
        </div>
      </div>

      {/* Token Usage */}
      <div className="p-4 border-b border-white/[0.04]">
        <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Token Usage</h3>
        <div className="space-y-2">
          <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((tokenCount / 4) / 1000 * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/30">
            <span>{Math.round(tokenCount / 4)} tokens</span>
            <span>100K limit</span>
          </div>
        </div>
      </div>

      {/* Execution Pipeline */}
      <div className="p-4 border-b border-white/[0.04]">
        <button
          onClick={() => toggleSection("pipeline")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Execution Pipeline</h3>
          {expandedSections.pipeline ? (
            <ChevronUp className="w-3 h-3 text-white/30" />
          ) : (
            <ChevronDown className="w-3 h-3 text-white/30" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.pipeline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-0 overflow-hidden"
            >
              {pipelineSteps.map((step, i) => {
                const isActive = streaming && i === pipelineSteps.length - 2
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isActive ? "bg-blue-400 animate-pulse" : "bg-white/10"
                      )} />
                      {i < pipelineSteps.length - 1 && (
                        <div className="w-px h-4 bg-white/[0.06]" />
                      )}
                    </div>
                    <span className={cn("text-[11px]", step.color)}>{step.label}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Papers */}
      <div className="p-4">
        <button
          onClick={() => toggleSection("papers")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Recent Papers</h3>
          {expandedSections.papers ? (
            <ChevronUp className="w-3 h-3 text-white/30" />
          ) : (
            <ChevronDown className="w-3 h-3 text-white/30" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.papers && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              {recentPapers.map((paper, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-medium text-white/70 group-hover:text-white/90 transition-colors line-clamp-2">
                    {paper.title}
                  </div>
                  <div className="text-[10px] text-white/30 mt-1">
                    {paper.authors} · {paper.year}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40">{paper.journal}</span>
                    <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors ml-auto" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
