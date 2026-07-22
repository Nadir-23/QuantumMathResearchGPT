import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuantumMathResearchGPT — Scientific AI Copilot",
  description: "Professional multi-agent scientific AI assistant for mathematics, quantum physics, quantum computing, symbolic computation, and research.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#08131F] text-white font-sans antialiased">{children}</body>
    </html>
  )
}
