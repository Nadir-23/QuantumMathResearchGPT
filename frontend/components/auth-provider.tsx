"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Loader2 } from "lucide-react"

const publicPaths = ["/login", "/register", "/"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    checkAuth()
    setMounted(true)
  }, [checkAuth])

  useEffect(() => {
    if (!mounted) return

    const isPublicPath = publicPaths.some((path) => pathname === path)

    if (!isLoading && !isAuthenticated && !isPublicPath) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#08131F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
