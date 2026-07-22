import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  created_at: string | null
  roles: string[]
  permissions: string[]
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  login: (identifier: string, password: string) => Promise<{ error?: string }>
  register: (email: string, username: string, password: string, fullName?: string) => Promise<{ error?: string }>
  logout: () => void
  checkAuth: () => Promise<void>
  refreshAccessToken: () => Promise<boolean>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const AUTH_COOKIE_NAME = "auth-storage"
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

function extractError(data: Record<string, unknown>, fallback: string): string {
  const detail = data.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as Record<string, unknown>
    if (typeof first.msg === "string") return first.msg
  }
  return fallback
}

function setAuthCookie(value: string) {
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`
}

function removeAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`
}

const dualStorage: Storage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(name)
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value)
    setAuthCookie(value)
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
    removeAuthCookie()
  },
  clear: () => {
    localStorage.clear()
    removeAuthCookie()
  },
  key: (index: number) => localStorage.key(index),
  get length() { return localStorage.length },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isAuthenticated: true })
      },

      login: async (identifier, password) => {
        try {
          const res = await fetch(`${API_URL}/auth/login/json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: identifier.trim(), password }),
          })

          const data = await res.json()

          if (!res.ok) {
            return { error: extractError(data, "Login failed") }
          }

          set({
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          })

          return {}
        } catch (err: unknown) {
          if (err instanceof TypeError && err.message.includes("fetch")) {
            return { error: "Cannot connect to server. Please check your connection." }
          }
          if (err instanceof DOMException && err.name === "AbortError") {
            return { error: "Request timed out. Please try again." }
          }
          console.error("Login error:", err)
          return { error: "An unexpected error occurred. Please try again." }
        }
      },

      register: async (email, username, password, fullName) => {
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.trim().toLowerCase(),
              username: username.trim(),
              password,
              full_name: fullName?.trim() || null,
            }),
          })

          const data = await res.json()

          if (!res.ok) {
            return { error: extractError(data, "Registration failed") }
          }

          set({
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          })

          return {}
        } catch (err: unknown) {
          if (err instanceof TypeError && err.message.includes("fetch")) {
            return { error: "Cannot connect to server. Please check your connection." }
          }
          console.error("Registration error:", err)
          return { error: "An unexpected error occurred. Please try again." }
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      checkAuth: async () => {
        const { accessToken, refreshToken } = get()

        if (!accessToken) {
          set({ isLoading: false, isAuthenticated: false })
          return
        }

        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })

          if (res.ok) {
            const user = await res.json()
            set({ user, isAuthenticated: true, isLoading: false })
          } else if (refreshToken) {
            const refreshed = await get().refreshAccessToken()
            if (!refreshed) {
              get().logout()
            } else {
              set({ isLoading: false })
            }
          } else {
            get().logout()
          }
        } catch {
          get().logout()
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) return false

        try {
          const res = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          })

          if (!res.ok) return false

          const data = await res.json()
          set({
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
          })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: AUTH_COOKIE_NAME,
      storage: createJSONStorage(() => dualStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
