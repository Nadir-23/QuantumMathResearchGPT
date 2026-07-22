"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Crown, User, Copy, Check, LogIn, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { demoAccounts, type DemoAccount } from "@/config/demoAccounts"

function getShowDemo(): boolean {
  if (process.env.NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS === "true") return true
  if (process.env.NODE_ENV === "development") return true
  return false
}

interface Toast {
  id: number
  message: string
}

let toastCounter = 0

interface DemoCredentialsProps {
  onFill?: (email: string, password: string) => void
  className?: string
}

function CopiedField({
  value,
  label,
  onCopy,
}: {
  value: string
  label: string
  onCopy: (text: string, label: string) => void
}) {
  const [justCopied, setJustCopied] = useState(false)

  const handleCopy = () => {
    onCopy(value, `${label} copied!`)
    setJustCopied(true)
    setTimeout(() => setJustCopied(false), 1500)
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[11px] text-white/30 w-16 shrink-0 uppercase tracking-wider font-medium">
        {label}
      </span>
      <code className="text-xs text-white/60 font-mono truncate flex-1 select-all">
        {value}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "p-1.5 rounded-lg transition-all duration-200",
          justCopied
            ? "text-emerald-400 bg-emerald-500/10"
            : "text-white/20 hover:text-white/60 hover:bg-white/5"
        )}
        aria-label={`Copy ${label.toLowerCase()}: ${value}`}
        tabIndex={0}
      >
        {justCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  )
}

function AccountCard({
  account,
  onFill,
  onCopy,
}: {
  account: DemoAccount
  onFill: () => void
  onCopy: (text: string, label: string) => void
}) {
  const Icon = account.icon === "crown" ? Crown : User
  const [justFilled, setJustFilled] = useState(false)

  const handleFill = () => {
    onFill()
    setJustFilled(true)
    setTimeout(() => setJustFilled(false), 1500)
  }

  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200 group/card">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
            account.icon === "crown"
              ? "bg-amber-500/10 text-amber-400"
              : "bg-blue-500/10 text-blue-400"
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-white/80 block">{account.label}</span>
          <span className="text-[10px] text-white/30">{account.description}</span>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <CopiedField value={account.email} label="Email" onCopy={onCopy} />
        <CopiedField value={account.password} label="Pass" onCopy={onCopy} />
      </div>

      <button
        type="button"
        onClick={handleFill}
        className={cn(
          "w-full h-8 rounded-lg text-[11px] font-medium transition-all duration-200 flex items-center justify-center gap-1.5",
          justFilled
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:border-white/[0.10]"
        )}
        aria-label={`Auto-fill login form with ${account.label} credentials`}
        tabIndex={0}
      >
        {justFilled ? (
          <>
            <Check className="w-3 h-3" />
            Filled!
          </>
        ) : (
          <>
            <LogIn className="w-3 h-3" />
            Login as {account.id === "admin" ? "Admin" : "User"}
          </>
        )}
      </button>
    </div>
  )
}

export function DemoCredentials({ onFill, className }: DemoCredentialsProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 2500)
    return () => clearTimeout(timer)
  }, [toasts])

  const copyToClipboard = useCallback(async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    setToasts((prev) => [...prev, { id: ++toastCounter, message }])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  if (!getShowDemo()) return null

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "mt-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.06] backdrop-blur-sm",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/[0.06]">
          <div className="w-5 h-5 rounded-md bg-blue-500/10 flex items-center justify-center">
            <Crown className="w-3 h-3 text-blue-400" />
          </div>
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
            Demo Accounts
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {demoAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onFill={() => onFill?.(account.email, account.password)}
              onCopy={copyToClipboard}
            />
          ))}
        </div>
      </div>

      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827]/95 border border-white/[0.08] backdrop-blur-xl shadow-soft animate-slide-up"
              role="status"
              aria-live="polite"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-xs text-white/70">{t.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="ml-2 p-0.5 rounded text-white/20 hover:text-white/50 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
