"use client"

import { motion } from "framer-motion"
import { BookOpen, ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

interface DerivationCardProps {
  title: string
  content: string
}

export default function DerivationCard({ title, content }: DerivationCardProps) {
  const [expanded, setExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-border overflow-hidden my-3"
    >
      <div className="relative z-10 bg-[#111827] rounded-[18px]">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-[13px] font-semibold text-white">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy() }}
              className="p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-white/30" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/30" />
            )}
          </div>
        </button>

        {/* Content */}
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3"
          >
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
