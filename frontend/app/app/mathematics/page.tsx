"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Play, Copy, Download, Sigma, Variable, Pi } from "lucide-react"

const SYMBOLS = [
  { label: "∫", insert: "∫" }, { label: "∂", insert: "∂" }, { label: "∑", insert: "∑" },
  { label: "∏", insert: "∏" }, { label: "√", insert: "√" }, { label: "∞", insert: "∞" },
  { label: "π", insert: "π" }, { label: "θ", insert: "θ" }, { label: "φ", insert: "φ" },
  { label: "λ", insert: "λ" }, { label: "α", insert: "α" }, { label: "β", insert: "β" },
  { label: "γ", insert: "γ" }, { label: "δ", insert: "δ" }, { label: "ε", insert: "ε" },
  { label: "∈", insert: "∈" }, { label: "∀", insert: "∀" }, { label: "∃", insert: "∃" },
]

const OPERATIONS = ["Simplify", "Differentiate", "Integrate", "Solve", "Expand", "Factor", "Matrix", "Eigenvalues"]

export default function MathematicsPage() {
  const [expression, setExpression] = useState("")
  const [result, setResult] = useState("")

  function handleOperation(op: string) {
    if (!expression.trim()) return
    setResult(`// ${op} operation on: ${expression}\n// Result would appear here with LaTeX rendering`)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Mathematics</h1>
        <p className="text-sm text-white/40">Symbolic computation, equation solving, and mathematical analysis</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-3">
            <label className="text-xs text-white/40 mb-2 block">Expression Editor</label>
            <Textarea value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="Enter a mathematical expression, e.g.: x^3 - 6x^2 + 11x - 6" rows={3} className="font-mono text-lg" />
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {SYMBOLS.map((s) => (
              <button key={s.label} onClick={() => setExpression((prev) => prev + s.insert)} className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-mono">{s.label}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {OPERATIONS.map((op) => (
              <Button key={op} variant="secondary" size="sm" onClick={() => handleOperation(op)} className="text-[12px]">{op}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-white/40">Result</label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-[11px]"><Copy className="w-3 h-3 mr-1" /> Copy</Button>
              <Button variant="ghost" size="sm" className="text-[11px]"><Download className="w-3 h-3 mr-1" /> Export</Button>
            </div>
          </div>
          <div className="min-h-[200px] rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 font-mono text-sm text-white/60">
            {result || <span className="text-white/20">Enter an expression and select an operation to see results...</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Matrix Visualization</h3>
          <div className="grid grid-cols-3 gap-2 max-w-xs">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-sm text-white/40 font-mono">
                {i % 4 === 0 ? "1" : "0"}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
