import type { Metadata } from "next"
import { Atom } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "QuantumMathResearchGPT — Authentication",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08131F] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Quantum<span className="text-blue-400">Math</span>
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
