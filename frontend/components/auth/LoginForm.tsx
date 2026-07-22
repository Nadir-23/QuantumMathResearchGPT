"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth-store"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { DemoCredentials } from "@/components/auth/DemoCredentials"

export function LoginForm() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuthStore()
  const [callbackUrl, setCallbackUrl] = useState("/app/chat")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCallbackUrl(params.get("callback") || "/app/chat")
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl)
    }
  }, [isAuthenticated, router, callbackUrl])

  const doLogin = async (email: string, pw: string) => {
    setError("")
    setLoading(true)

    const result = await login(email, pw)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedIdentifier = identifier.trim()
    if (!trimmedIdentifier) {
      setError("Username or email is required")
      return
    }
    if (!password) {
      setError("Password is required")
      return
    }

    await doLogin(trimmedIdentifier, password)
  }

  return (
    <div suppressHydrationWarning className="p-8 rounded-2xl bg-[#111827]/80 border border-white/[0.06] backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-sm text-white/40">Sign in to continue to QuantumMathResearchGPT</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="login-identifier" className="text-xs text-white/40">
            Username or Email
          </label>
          <input
            id="login-identifier"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value)
              setError("")
            }}
            placeholder="Enter your username or email"
            required
            autoComplete="username"
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/[0.08] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="login-password" className="text-xs text-white/40">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full h-11 px-4 pr-11 rounded-xl bg-white/5 border border-white/[0.08] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>

      <DemoCredentials
        onFill={(email, pw) => {
          setIdentifier(email)
          setPassword(pw)
          setError("")
          doLogin(email, pw)
        }}
      />
    </div>
  )
}
