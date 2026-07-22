"use client"

import { useState, useEffect, Suspense } from "react"
import { LoginForm } from "@/components/auth/LoginForm"

function LoginContent() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-8 rounded-2xl bg-[#111827]/80 border border-white/[0.06] backdrop-blur-xl flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return <LoginForm />
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
