"use client"

import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react"

interface VerificationCardProps {
  checks: { label: string; passed: boolean }[]
}

export default function VerificationCard({ checks }: VerificationCardProps) {
  const passedCount = checks.filter(c => c.passed).length
  const allPassed = passedCount === checks.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[18px] border border-white/[0.06] bg-[#111827]/80 p-4 my-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${allPassed ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
          <ShieldCheck className={`w-3.5 h-3.5 ${allPassed ? "text-emerald-400" : "text-amber-400"}`} />
        </div>
        <span className="text-[13px] font-semibold text-white">Verification</span>
        <span className={`ml-auto text-[11px] font-medium px-2 py-0.5 rounded-full ${allPassed ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
          {passedCount}/{checks.length} Passed
        </span>
      </div>

      <div className="space-y-1.5">
        {checks.map((check, i) => (
          <motion.div
            key={check.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 text-[12px]"
          >
            {check.passed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            )}
            <span className={check.passed ? "text-white/60" : "text-white/40"}>{check.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
