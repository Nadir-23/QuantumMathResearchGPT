"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Equal,
  FunctionSquare,
  Sigma,
  TrendingDown,
  Grid3X3,
  Shrink,
  Expand,
  RotateCcw,
  Copy,
  Check,
  Download,
  Loader2,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import katex from "katex"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const symbolPalette = [
  { category: "Greek", symbols: ["α", "β", "γ", "δ", "ε", "θ", "λ", "μ", "π", "σ", "φ", "ψ", "ω", "Δ", "Σ", "Ω"] },
  { category: "Operators", symbols: ["∫", "∂", "∇", "∞", "±", "×", "÷", "≤", "≥", "≠", "≈", "∈", "⊂", "∪", "∩", "∀"] },
  { category: "Functions", symbols: ["sin", "cos", "tan", "log", "ln", "exp", "lim", "det", "dim", "ker", "gcd", "mod"] },
  { category: "Notation", symbols: ["|ψ⟩", "⟨φ|", "⊗", "†", "∘", "↦", "→", "⇒", "⇔", "∴", "∵"] },
]

const presetEquations = [
  { label: "Euler's Identity", latex: "e^{i\\pi} + 1 = 0", expr: "E**(I*pi) + 1" },
  { label: "Schrödinger Eq.", latex: "i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi", expr: "" },
  { label: "Maxwell's Eq.", latex: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}", expr: "" },
  { label: "Einstein Field Eq.", latex: "R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}", expr: "" },
  { label: "Dirac Equation", latex: "(i\\gamma^\\mu \\partial_\\mu - m)\\psi = 0", expr: "" },
  { label: "Euler-Lagrange", latex: "\\frac{\\partial L}{\\partial q} - \\frac{d}{dt}\\frac{\\partial L}{\\partial \\dot{q}} = 0", expr: "" },
]

const matrixPresets = [
  { label: "2×2 Identity", matrix: [["1", "0"], ["0", "1"]] },
  { label: "Pauli X", matrix: [["0", "1"], ["1", "0"]] },
  { label: "Pauli Y", matrix: [["0", "-I"], ["I", "0"]] },
  { label: "Pauli Z", matrix: [["1", "0"], ["0", "-1"]] },
  { label: "Hadamard", matrix: [["1/sqrt(2)", "1/sqrt(2)"], ["1/sqrt(2)", "-1/sqrt(2)"]] },
]

function renderLatex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
      trust: true,
    })
  } catch {
    return latex
  }
}

export default function MathematicsPage() {
  const [equation, setEquation] = useState("\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}")
  const [expression, setExpression] = useState("x**3 - 6*x**2 + 11*x - 6")
  const [variable, setVariable] = useState("x")
  const [matrixSize, setMatrixSize] = useState(2)
  const [matrix, setMatrix] = useState<string[][]>(
    Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => "0"))
  )
  const [activeTab, setActiveTab] = useState<"equation" | "matrix" | "ode">("equation")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [resultType, setResultType] = useState<string>("")
  const [plotData, setPlotData] = useState<{ x: number; y: number }[] | null>(null)
  const [plotExpr, setPlotExpr] = useState<string>("")
  const [odeExpr, setOdeExpr] = useState("Diff(y(x), x) + y(x)")
  const [odeFunc, setOdeFunc] = useState("y")
  const [odeVar, setOdeVar] = useState("x")
  const [odeMode, setOdeMode] = useState<"analytical" | "numerical">("analytical")
  const [odeTSpan, setOdeTSpan] = useState("0, 10")
  const [odeY0, setOdeY0] = useState("1")
  const [odeMethod, setOdeMethod] = useState("RK45")

  const handleCopy = () => {
    navigator.clipboard.writeText(equation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateMatrixSize = (size: number) => {
    setMatrixSize(size)
    setMatrix(Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => (i === j ? "1" : "0"))
    ))
  }

  const callApi = useCallback(
    async (endpoint: string, body: any, type: string) => {
      setLoading(true)
      setResult(null)
      setResultType(type)
      setPlotData(null)
      try {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: res.statusText }))
          setResult({ error: err.detail || "Request failed" })
          return
        }
        const data = await res.json()
        if (type === "plot" && data.x && data.y) {
          const points = data.x.map((x: number, i: number) => ({
            x: Math.round(x * 1000) / 1000,
            y: Math.round(data.y[i] * 1000) / 1000,
          }))
          setPlotData(points)
          setPlotExpr(data.latex || expression)
        }
        setResult(data)
      } catch (err: any) {
        setResult({ error: err.message || "Network error" })
      } finally {
        setLoading(false)
      }
    },
    [expression]
  )

  const handleEquationOp = (op: string) => {
    const expr = expression
    switch (op) {
      case "Simplify":
        callApi("/math/simplify", { expr }, "simplify")
        break
      case "Differentiate":
        callApi("/math/differentiate", { expr, variable }, "differentiate")
        break
      case "Integrate":
        callApi("/math/integrate", { expr, variable }, "integrate")
        break
      case "Solve":
        callApi("/math/solve", { expr, variable }, "solve")
        break
      case "Expand":
        callApi("/math/expand", { expr }, "expand")
        break
      case "Factor":
        callApi("/math/factor", { expr }, "factor")
        break
      case "Plot":
        callApi("/math/plot", { expr, variable, x_start: -10, x_end: 10, num_points: 300 }, "plot")
        break
    }
  }

  const handleMatrixOp = (op: string) => {
    const matrixStr = JSON.stringify(matrix.map(row => row.map(v => v)))
    const endpoint = `/math/matrix/${op.toLowerCase()}`
    callApi(endpoint, { matrix: matrixStr }, `matrix_${op.toLowerCase()}`)
  }

  const handleOdeSolve = () => {
    if (odeMode === "analytical") {
      callApi("/math/ode", {
        equation: odeExpr,
        func: odeFunc,
        independent_var: odeVar,
      }, "ode_analytical")
    } else {
      const tSpan = odeTSpan.split(",").map(Number) as [number, number]
      const y0Arr = odeY0.split(",").map(Number)
      callApi("/math/ode/numerical", {
        equation: odeExpr,
        func: odeFunc,
        independent_var: odeVar,
        t_span: tSpan,
        y0: y0Arr,
        method: odeMethod,
      }, "ode_numerical")
    }
  }

  const handleExport = () => {
    if (!plotData) return
    const csv = "x,y\n" + plotData.map((p) => `${p.x},${p.y}`).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "function_plot.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  function renderResult() {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-3 py-12 text-white/40">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Computing...</span>
        </div>
      )
    }
    if (!result) {
      return <span className="text-white/20">Select an operation to see results...</span>
    }
    if (result.error) {
      return (
        <div className="flex items-start gap-3 py-4 text-red-400">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Error</p>
            <p className="text-xs text-red-400/70 mt-1">{result.error}</p>
          </div>
        </div>
      )
    }

    const d = result
    const t = resultType

    if (t === "simplify") {
      return (
        <div className="space-y-3">
          <ResultRow label="Original" latex={d.original} />
          <ResultRow label="Simplified" latex={d.simplified} highlighted />
        </div>
      )
    }
    if (t === "differentiate") {
      return (
        <div className="space-y-3">
          <ResultRow label="Function" latex={d.expr} />
          <ResultRow label={`Derivative (d/d${d.variable})`} latex={d.derivative} highlighted />
        </div>
      )
    }
    if (t === "integrate") {
      return (
        <div className="space-y-3">
          <ResultRow label="Integrand" latex={d.expr} />
          <ResultRow label={`Integral (d${d.variable})`} latex={d.integral} highlighted />
          <p className="text-[11px] text-white/30">+ C (constant of integration)</p>
        </div>
      )
    }
    if (t === "solve") {
      const solLatex = d.solutions_latex || []
      return (
        <div className="space-y-3">
          <ResultRow label="Equation" latex={`${d.expr} = 0`} />
          <div>
            <p className="text-[11px] text-white/40 mb-2">Solutions ({solLatex.length} found):</p>
            <div className="flex flex-wrap gap-2">
              {solLatex.map((sol: string, i: number) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300"
                  dangerouslySetInnerHTML={{
                    __html: katex.renderToString(sol, { throwOnError: false }),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }
    if (t === "expand") {
      return (
        <div className="space-y-3">
          <ResultRow label="Original" latex={d.original} />
          <ResultRow label="Expanded" latex={d.expanded} highlighted />
        </div>
      )
    }
    if (t === "factor") {
      return (
        <div className="space-y-3">
          <ResultRow label="Original" latex={d.original} />
          <ResultRow label="Factored" latex={d.factored} highlighted />
        </div>
      )
    }
    if (t.startsWith("matrix_")) {
      return (
        <div className="space-y-3">
          <ResultRow label="Matrix" latex={d.latex} />
          {d.eigenvalues && (
            <div>
              <p className="text-[11px] text-white/40 mb-2">Eigenvalues:</p>
              <div className="flex flex-wrap gap-2">
                {d.eigenvalues.map((ev: any, i: number) => (
                  <div key={i} className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    λ = <span dangerouslySetInnerHTML={{ __html: katex.renderToString(ev.value, { throwOnError: false }) }} />
                    {ev.multiplicity > 1 && <span className="text-xs text-white/30 ml-1">(mult. {ev.multiplicity})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {d.eigenvectors && (
            <div>
              <p className="text-[11px] text-white/40 mb-2">Eigenvectors:</p>
              <div className="space-y-2">
                {d.eigenvectors.map((ev: any, i: number) => (
                  <div key={i} className="px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-cyan-300">
                      λ = <span dangerouslySetInnerHTML={{ __html: katex.renderToString(ev.value, { throwOnError: false }) }} />
                    </span>
                    <div className="mt-1 space-y-1">
                      {ev.vectors_latex.map((v: string, j: number) => (
                        <div key={j} className="text-sm text-white/60" dangerouslySetInnerHTML={{ __html: katex.renderToString(v, { throwOnError: false }) }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {d.result_latex && !d.eigenvalues && !d.eigenvectors && (
            <ResultRow label="Result" latex={d.result_latex} highlighted />
          )}
          {d.U_latex && (
            <div className="grid grid-cols-3 gap-2">
              <ResultRow label="U" latex={d.U_latex} />
              <ResultRow label="S" latex={d.S_latex} />
              <ResultRow label="V" latex={d.V_latex} />
            </div>
          )}
          {!d.result_latex && !d.U_latex && !d.eigenvalues && !d.eigenvectors && (
            <pre className="text-xs text-white/50 whitespace-pre-wrap font-mono">{d.result}</pre>
          )}
        </div>
      )
    }

    if (t === "ode_analytical") {
      return (
        <div className="space-y-3">
          <ResultRow label="ODE" latex={d.equation_latex} />
          {d.ode_type && d.ode_type.length > 0 && (
            <p className="text-[11px] text-white/40">Type: {d.ode_type.slice(0, 3).join(", ")}</p>
          )}
          <ResultRow label="General Solution" latex={d.general_solution_latex} highlighted />
          {d.particular_solution_latex && (
            <ResultRow label="Particular Solution" latex={d.particular_solution_latex} highlighted />
          )}
        </div>
      )
    }

    if (t === "ode_numerical") {
      return (
        <div className="space-y-3">
          <div className="flex gap-4 text-[11px] text-white/40">
            <span>Method: {d.method}</span>
            <span>Points: {d.n_points}</span>
            <span>Status: {d.success ? "OK" : "Failed"}</span>
          </div>
          {!d.success && <p className="text-xs text-red-400">{d.message}</p>}
          {d.success && d.t && d.y && (
            <div>
              <p className="text-[11px] text-white/40 mb-2">Solution values:</p>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-white/40 border-b border-white/10">
                      <th className="text-left py-1 pr-4">t</th>
                      {d.y.map((_: any, i: number) => (
                        <th key={i} className="text-left py-1">y{i}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.t.map((t: number, i: number) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-1 pr-4 text-white/60 font-mono">{t.toFixed(4)}</td>
                        {d.y.map((yArr: number[], j: number) => (
                          <td key={j} className="py-1 text-white/60 font-mono">{yArr[i]?.toFixed(6)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )
    }

    return <pre className="text-xs text-white/50 whitespace-pre-wrap font-mono">{JSON.stringify(d, null, 2)}</pre>
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Mathematics</h1>
            <p className="text-sm text-white/50">Symbolic computation, equation editing, and matrix operations</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/[0.06] w-fit">
            {(["equation", "matrix", "ode"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
                {tab === "equation" ? "Equation Editor" : tab === "matrix" ? "Matrix Operations" : "ODE Solver"}
              </button>
            ))}
          </div>

          {/* ─── Equation Tab ─────────────────────────────────────── */}
          {activeTab === "equation" && (
            <div className="space-y-6">
              {/* Symbol Palette */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Symbol Palette</h3>
                {symbolPalette.map((group) => (
                  <div key={group.category}>
                    <div className="text-[10px] text-white/30 mb-1.5">{group.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {group.symbols.map((sym) => (
                        <button key={sym} onClick={() => setExpression(expression + sym)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/[0.06] text-sm text-white/70 hover:bg-white/10 hover:text-white hover:border-white/[0.12] transition-all font-mono">
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Expression Input */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Expression (SymPy Syntax)</h3>
                  <div className="flex gap-1">
                    <button onClick={handleCopy} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setExpression("")} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <textarea value={expression} onChange={(e) => setExpression(e.target.value)}
                  className="w-full h-20 p-3 rounded-xl bg-white/5 border border-white/[0.08] text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="e.g.: x**3 - 6*x**2 + 11*x - 6" />
                <div className="flex items-center gap-3">
                  <label className="text-xs text-white/40">Variable:</label>
                  <input value={variable} onChange={(e) => setVariable(e.target.value)}
                    className="w-16 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              {/* Operation Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Simplify", icon: Equal },
                  { label: "Differentiate", icon: TrendingDown },
                  { label: "Integrate", icon: FunctionSquare },
                  { label: "Solve", icon: Sigma },
                  { label: "Expand", icon: Expand },
                  { label: "Factor", icon: Shrink },
                  { label: "Plot", icon: TrendingUp },
                ].map(({ label, icon: Icon }) => (
                  <button key={label} onClick={() => handleEquationOp(label)} disabled={loading || !expression.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-sm text-white/60 hover:bg-white/10 hover:text-white hover:border-white/[0.12] transition-all disabled:opacity-40">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />} {label}
                  </button>
                ))}
              </div>

              {/* Result */}
              {result && (
                <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Result</h3>
                    {plotData && (
                      <button onClick={handleExport} className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors">
                        <Download className="w-3 h-3" /> Export CSV
                      </button>
                    )}
                  </div>
                  <div className="min-h-[80px] rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 text-sm text-white/60">
                    {renderResult()}
                  </div>
                </div>
              )}

              {/* Plot */}
              {plotData && plotData.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06]">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Function Plot</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={plotData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="x" stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "12px" }}
                          labelStyle={{ color: "rgba(255,255,255,0.5)" }} itemStyle={{ color: "#4F7CFF" }}
                          formatter={(value) => [Number(value).toFixed(4), "y"]} />
                        <Line type="monotone" dataKey="y" stroke="#4F7CFF" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#4F7CFF" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Famous Equations */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Famous Equations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {presetEquations.map((eq) => (
                    <button key={eq.label}
                      onClick={() => { if (eq.expr) setExpression(eq.expr) }}
                      className="text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group">
                      <div className="text-[10px] text-white/40 mb-1 group-hover:text-white/60 transition-colors">{eq.label}</div>
                      <div className="text-sm text-white/70 font-mono truncate group-hover:text-white transition-colors">{eq.latex}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Matrix Tab ──────────────────────────────────────── */}
          {activeTab === "matrix" && (
            <div className="space-y-6">
              {/* Size Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/50">Matrix Size:</span>
                <div className="flex gap-1">
                  {[2, 3, 4].map((size) => (
                    <button key={size} onClick={() => updateMatrixSize(size)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${matrixSize === size ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/5 text-white/40 border border-white/[0.06] hover:text-white"}`}>
                      {size}×{size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matrix Editor */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.06]">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Matrix Editor</h3>
                <div className="flex justify-center">
                  <div className="relative p-4">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/20 rounded-full" />
                    <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-white/20 rounded-full" />
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
                      {matrix.map((row, i) =>
                        row.map((val, j) => (
                          <input key={`${i}-${j}`} value={val}
                            onChange={(e) => { const nm = [...matrix]; nm[i] = [...nm[i]]; nm[i][j] = e.target.value; setMatrix(nm) }}
                            className="w-16 h-10 text-center rounded-lg bg-white/5 border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Matrix Operations */}
              <div className="flex flex-wrap gap-2">
                {["Determinant", "Inverse", "Eigenvalues", "Eigenvectors", "Trace", "Rank", "SVD", "Transpose"].map((op) => (
                  <button key={op} onClick={() => handleMatrixOp(op)} disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-sm text-white/60 hover:bg-white/10 hover:text-white hover:border-white/[0.12] transition-all disabled:opacity-40">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Grid3X3 className="w-4 h-4" />} {op}
                  </button>
                ))}
              </div>

              {/* Matrix Result */}
              {result && resultType.startsWith("matrix_") && (
                <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Result</h3>
                  <div className="min-h-[80px] rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 text-sm text-white/60">
                    {renderResult()}
                  </div>
                </div>
              )}

              {/* Quantum Gate Presets */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Quantum Gate Presets</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {matrixPresets.map((preset) => (
                    <button key={preset.label}
                      onClick={() => { setMatrixSize(preset.matrix.length); setMatrix(preset.matrix) }}
                      className="text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                      <div className="text-xs text-white/60 mb-1">{preset.label}</div>
                      <div className="text-[10px] text-white/30 font-mono">{preset.matrix.map((r) => r.join(" ")).join(" | ")}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── ODE Tab ──────────────────────────────────────── */}
          {activeTab === "ode" && (
            <div className="space-y-6">
              {/* ODE Mode Toggle */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/[0.06] w-fit">
                {(["analytical", "numerical"] as const).map((mode) => (
                  <button key={mode} onClick={() => setOdeMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${odeMode === mode ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
                    {mode === "analytical" ? "Analytical (dsolve)" : "Numerical (solve_ivp)"}
                  </button>
                ))}
              </div>

              {/* ODE Input */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {odeMode === "analytical" ? "ODE Equation (SymPy Syntax)" : "Right-Hand Side f(x, y)"}
                </h3>
                <textarea
                  value={odeExpr}
                  onChange={(e) => setOdeExpr(e.target.value)}
                  className="w-full h-20 p-3 rounded-xl bg-white/5 border border-white/[0.08] text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder={odeMode === "analytical" ? "e.g.: Diff(y(x), x) + y(x)" : "e.g.: -y or x + y"}
                />
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-white/40">Function:</label>
                    <input value={odeFunc} onChange={(e) => setOdeFunc(e.target.value)}
                      className="w-16 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-white/40">Variable:</label>
                    <input value={odeVar} onChange={(e) => setOdeVar(e.target.value)}
                      className="w-16 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  {odeMode === "numerical" && (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-white/40">t span:</label>
                        <input value={odeTSpan} onChange={(e) => setOdeTSpan(e.target.value)}
                          className="w-28 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="0, 10" />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-white/40">y(0):</label>
                        <input value={odeY0} onChange={(e) => setOdeY0(e.target.value)}
                          className="w-20 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-white/40">Method:</label>
                        <select value={odeMethod} onChange={(e) => setOdeMethod(e.target.value)}
                          className="h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 text-sm font-mono px-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
                          {["RK45", "RK23", "DOP853", "Radau", "BDF", "LSODA"].map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Solve Button */}
              <button onClick={handleOdeSolve} disabled={loading || !odeExpr.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-sm text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-all disabled:opacity-40">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sigma className="w-4 h-4" />} Solve ODE
              </button>

              {/* ODE Result */}
              {result && (resultType === "ode_analytical" || resultType === "ode_numerical") && (
                <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Result</h3>
                  <div className="min-h-[80px] rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 text-sm text-white/60">
                    {renderResult()}
                  </div>
                </div>
              )}

              {/* ODE Presets */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-3">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Common ODEs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    { label: "Exponential decay", expr: "Diff(y(x), x) + y(x)", desc: "y' + y = 0" },
                    { label: "Simple harmonic", expr: "Diff(y(x), x, 2) + y(x)", desc: "y'' + y = 0" },
                    { label: "Damped harmonic", expr: "Diff(y(x), x, 2) + 2*Diff(y(x), x) + y(x)", desc: "y'' + 2y' + y = 0" },
                    { label: "Logistic growth", expr: "Diff(y(x), x) - y(x)*(1 - y(x))", desc: "y' = y(1-y)" },
                    { label: "First-order linear", expr: "Diff(y(x), x) + 2*x*y(x)", desc: "y' + 2xy = 0" },
                    { label: "Numerical: decay", expr: "-y", desc: "dy/dx = -y, y(0)=1" },
                  ].map((preset) => (
                    <button key={preset.label}
                      onClick={() => {
                        setOdeExpr(preset.expr)
                        if (preset.expr.includes("Diff")) setOdeMode("analytical")
                        else setOdeMode("numerical")
                      }}
                      className="text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group">
                      <div className="text-[10px] text-white/40 mb-1 group-hover:text-white/60 transition-colors">{preset.label}</div>
                      <div className="text-sm text-white/70 font-mono truncate group-hover:text-white transition-colors">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResultRow({ label, latex, highlighted = false }: { label: string; latex: string; highlighted?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-white/40 mb-1">{label}</p>
      <div
        className={`rounded-lg px-3 py-2 ${highlighted ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/[0.03] border border-white/[0.05]"}`}
        dangerouslySetInnerHTML={{ __html: renderLatex(latex) }}
      />
    </div>
  )
}
