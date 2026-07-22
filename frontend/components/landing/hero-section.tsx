import { type ReactNode } from "react"
import Link from "next/link"
import {
  ArrowRight, Play, Atom, FlaskConical, Search, Code2, ShieldCheck,
  GraduationCap, ChevronRight,
} from "lucide-react"
import ParticleField from "./particle-field"

const features = [
  { icon: GraduationCap, title: "Mathematics", desc: "Step-by-step symbolic derivations, calculus, linear algebra, and more.", color: "from-blue-500 to-blue-600", glow: "shadow-blue-500/20" },
  { icon: FlaskConical, title: "Quantum Physics", desc: "Schrödinger equation, operators, bra-ket notation, quantum field theory.", color: "from-purple-500 to-purple-600", glow: "shadow-purple-500/20" },
  { icon: Atom, title: "Quantum Computing", desc: "Qiskit circuits, Bell states, quantum gates, error correction.", color: "from-cyan-500 to-cyan-600", glow: "shadow-cyan-500/20" },
  { icon: Search, title: "Research", desc: "ArXiv search, literature review, research gap analysis.", color: "from-emerald-500 to-emerald-600", glow: "shadow-emerald-500/20" },
  { icon: Code2, title: "Code Generation", desc: "Python, Julia, MATLAB, Qiskit, TensorFlow, PyTorch.", color: "from-amber-500 to-amber-600", glow: "shadow-amber-500/20" },
  { icon: ShieldCheck, title: "Verification", desc: "Mathematical proof checking, unit consistency, physical validation.", color: "from-rose-500 to-rose-600", glow: "shadow-rose-500/20" },
]

const stats = [
  { label: "Equations Solved", value: "10M+" },
  { label: "Quantum Simulations", value: "1M+" },
  { label: "Code Generated", value: "50M+" },
  { label: "Papers Analyzed", value: "100K+" },
]

function MotionFadeIn({
  children,
  className,
  delay = 0,
  ...rest
}: {
  children: ReactNode
  className?: string
  delay?: number
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`hero-fade-in ${className ?? ""}`.trim()}
      style={{ animationDelay: `${delay}s` }}
      {...rest}
    >
      {children}
    </div>
  )
}

function MotionFadeInView({
  children,
  className,
  delay = 0,
  ...rest
}: {
  children: ReactNode
  className?: string
  delay?: number
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`hero-fade-in ${className ?? ""}`.trim()}
      style={{ animationDelay: `${delay}s` }}
      {...rest}
    >
      {children}
    </div>
  )
}

function FloatingEquations() {
  const equations = [
    { label: "Hamiltonian", eq: "Ĥ|ψ⟩ = E|ψ⟩" },
    { label: "Wavefunction", eq: "Ψ(x,t)" },
    { label: "Feynman Path", eq: "∫ 𝒟x e^{iS/ℏ}" },
  ]

  return (
    <div className="mt-16 grid grid-cols-3 gap-3 max-w-lg mx-auto">
      {equations.map((item, i) => (
        <div
          key={item.label}
          className="hero-float"
          style={{ animationDelay: `${i * 0.5}s` }}
        >
          <div className="rounded-[18px] bg-white/[0.03] border border-white/[0.05] px-3 py-3 text-center">
            <div className="text-[8px] text-white/25 uppercase tracking-widest mb-1">{item.label}</div>
            <div className="text-[13px] font-mono text-white/60">{item.eq}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-[#08111F]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#08111F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <Atom className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-white">QuantumMath<span className="text-blue-400">ResearchGPT</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {["Features", "Documentation", "GitHub"].map((item) => (
              <a key={item} href="#" className="px-3 py-1.5 text-[13px] text-white/40 hover:text-white/70 rounded-lg hover:bg-white/[0.04] transition-all">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="inline-flex items-center justify-center h-9 px-3 rounded-xl text-[12px] font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200">Sign In</Link>
            <Link href="/register" className="inline-flex items-center justify-center h-9 px-3 rounded-xl text-[12px] font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all duration-200">Get Started <ArrowRight className="w-3 h-3 ml-1" /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.08] rounded-full blur-[120px]" />
        <ParticleField />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <MotionFadeIn className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] text-white/50 font-medium">Multi-Agent Scientific AI Platform</span>
          </MotionFadeIn>

          <MotionFadeIn className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5" delay={0.1}>
            <span className="text-white">Scientific AI Copilot</span><br />
            <span className="gradient-text">for Mathematics & Quantum Computing</span>
          </MotionFadeIn>

          <MotionFadeIn className="text-[15px] sm:text-base text-white/40 max-w-2xl mx-auto mb-8 leading-relaxed" delay={0.2}>
            Solve mathematics, simulate quantum systems, perform symbolic computation, generate scientific code, analyze research papers, and verify every result with AI.
          </MotionFadeIn>

          <MotionFadeIn className="flex flex-col sm:flex-row items-center justify-center gap-3" delay={0.3}>
            <Link href="/register" className="group inline-flex items-center justify-center h-12 px-6 min-w-[200px] rounded-xl text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all duration-200">Start Research <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" /></Link>
            <button type="button" className="inline-flex items-center justify-center h-12 px-6 min-w-[200px] rounded-xl text-base font-medium bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"><Play className="w-3.5 h-3.5 mr-2" /> View Documentation</button>
          </MotionFadeIn>

          <FloatingEquations />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#08111F] to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <MotionFadeInView className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Powered by <span className="gradient-text">Specialized Agents</span></h2>
            <p className="text-sm text-white/40 max-w-xl mx-auto">Six expert AI agents work together to solve your most complex scientific problems.</p>
          </MotionFadeInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <MotionFadeInView key={f.title} delay={i * 0.05}>
                <Link href="/app/chat" className="group block p-5 rounded-[18px] bg-[#111827]/60 border border-white/[0.05] hover:border-white/[0.1] hover:bg-[#111827] transition-all duration-300 h-full cursor-pointer">
                  <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${f.color} shadow-lg ${f.glow} mb-3`}><f.icon className="w-4 h-4 text-white" /></div>
                  <h3 className="text-[14px] font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                  <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
                </Link>
              </MotionFadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <MotionFadeInView key={s.label} delay={i * 0.1} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-[11px] text-white/30 uppercase tracking-wider">{s.label}</div>
            </MotionFadeInView>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <MotionFadeInView>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start Your Research</h2>
            <p className="text-sm text-white/40 mb-8">Free and open source. Create an account to get started.</p>
            <Link href="/register" className="group inline-flex items-center justify-center h-14 px-8 rounded-xl text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all duration-200">Create Free Account <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" /></Link>
          </MotionFadeInView>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-white/20" />
            <span className="text-[12px] text-white/25">© 2026 QuantumMathResearchGPT</span>
          </div>
          <div className="flex items-center gap-4">
            {["Docs", "GitHub", "Twitter"].map((item) => (
              <a key={item} href="#" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
