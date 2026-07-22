"use client"

import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center hero-fade-in">
        <div className="text-[80px] font-bold gradient-text mb-4 hero-fade-in" style={{ animationDelay: "0.1s" }}>
          404
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-sm text-white/40 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/app/chat">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Go to Chat
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
