import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/login", "/register", "/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next()
  }

  const authStorage = request.cookies.get("auth-storage")
  if (authStorage) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authStorage.value))
      const state = parsed.state ?? parsed
      if (state?.isAuthenticated && state?.accessToken) {
        return NextResponse.next()
      }
    } catch {
      // Invalid cookie, fall through to redirect
    }
  }

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("callback", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/app/:path*"],
}
