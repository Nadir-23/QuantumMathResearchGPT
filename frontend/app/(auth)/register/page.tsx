"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth-store"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.push("/app/chat")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated) {
    return (
      <div className="p-8 rounded-2xl bg-[#111827]/80 border border-white/[0.06] backdrop-blur-xl flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedUsername = username.trim()
    const trimmedFullName = fullName.trim()

    if (!trimmedEmail) {
      errors.email = "Email is required"
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address"
    }

    if (!trimmedUsername) {
      errors.username = "Username is required"
    } else if (trimmedUsername.length < 3) {
      errors.username = "Username must be at least 3 characters"
    } else if (trimmedUsername.length > 32) {
      errors.username = "Username must be at most 32 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      errors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (fullName && trimmedFullName.length > 100) {
      errors.fullName = "Full name must be at most 100 characters"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function clearFieldError(field: string) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validate()) {
      return
    }

    setLoading(true)

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedUsername = username.trim()
    const trimmedFullName = fullName.trim()

    const result = await register(trimmedEmail, trimmedUsername, password, trimmedFullName || undefined)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/app/chat")
    }
  }

  return (
    <div className="p-8 rounded-2xl bg-[#111827]/80 border border-white/[0.06] backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-sm text-white/40">Join QuantumMathResearchGPT today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="reg-fullname" className="text-xs text-white/40">Full Name <span className="text-white/20">(optional)</span></label>
          <input
            id="reg-fullname"
            type="text"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); clearFieldError("fullName"); setError("") }}
            placeholder="Enter your full name"
            autoComplete="name"
            className={`w-full h-11 px-4 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              fieldErrors.fullName ? "border-red-500/50" : "border-white/[0.08]"
            }`}
          />
          {fieldErrors.fullName && <p className="text-xs text-red-400 mt-1">{fieldErrors.fullName}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="reg-email" className="text-xs text-white/40">Email</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); setError("") }}
            placeholder="Enter your email"
            required
            autoComplete="email"
            className={`w-full h-11 px-4 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              fieldErrors.email ? "border-red-500/50" : "border-white/[0.08]"
            }`}
          />
          {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="reg-username" className="text-xs text-white/40">Username</label>
          <input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); clearFieldError("username"); setError("") }}
            placeholder="Choose a username"
            required
            autoComplete="username"
            className={`w-full h-11 px-4 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              fieldErrors.username ? "border-red-500/50" : "border-white/[0.08]"
            }`}
          />
          {fieldErrors.username && <p className="text-xs text-red-400 mt-1">{fieldErrors.username}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="reg-password" className="text-xs text-white/40">Password</label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); setError("") }}
              placeholder="Create a password (min 8 characters)"
              required
              autoComplete="new-password"
              className={`w-full h-11 px-4 pr-11 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                fieldErrors.password ? "border-red-500/50" : "border-white/[0.08]"
              }`}
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
          {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="reg-confirm" className="text-xs text-white/40">Confirm Password</label>
          <input
            id="reg-confirm"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); setError("") }}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
            className={`w-full h-11 px-4 rounded-xl bg-white/5 border text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              fieldErrors.confirmPassword ? "border-red-500/50" : "border-white/[0.08]"
            }`}
          />
          {fieldErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{fieldErrors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
