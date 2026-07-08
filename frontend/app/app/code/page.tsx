"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Copy, Download, Check, Loader2, Terminal } from "lucide-react"
import { motion } from "framer-motion"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const languages = [
  { value: "python", label: "Python", monaco: "python" },
  { value: "julia", label: "Julia", monaco: "julia" },
  { value: "matlab", label: "MATLAB", monaco: "matlab" },
  { value: "qiskit", label: "Qiskit", monaco: "python" },
]

const templates: Record<string, string> = {
  python: `import numpy as np
from scipy.linalg import expm

# Quantum Mechanics: Time Evolution Operator
# H = ℏω σ_z / 2
hbar = 1.0
omega = 2 * np.pi
sigma_z = np.array([[1, 0], [0, -1]])

# Time evolution operator U(t) = exp(-iHt/ℏ)
def time_evolution(t):
    H = 0.5 * hbar * omega * sigma_z
    return expm(-1j * H * t / hbar)

# Calculate evolution at t = T/4
T = 2 * np.pi / omega
U = time_evolution(T / 4)
print("Time Evolution Operator U(T/4):")
print(np.round(U, 4))

# Initial state |+⟩ = (|0⟩ + |1⟩) / √2
psi_0 = np.array([1, 1]) / np.sqrt(2)
psi_t = U @ psi_0
print("\\nState at t = T/4:")
print(np.round(psi_t, 4))
print(f"\\nProbability |⟨0|ψ(t)⟩|² = {abs(psi_t[0])**2:.4f}")
print(f"Probability |⟨1|ψ(t)⟩|² = {abs(psi_t[1])**2:.4f}")`,
  julia: `using LinearAlgebra

# Quantum Mechanics: Spin-1/2 System
# Pauli matrices
σ_z = [1 0; 0 -1]
σ_x = [0 1; 1 0]
σ_y = [0 -im; im 0]

# Hamiltonian: H = ω σ_z
ω = 2π
H = ω * σ_z

# Eigenvalues and eigenvectors
λ, V = eigen(H)
println("Eigenvalues: ", λ)
println("Eigenvectors:\\n", V)

# Time evolution
function time_evolve(ψ₀, t)
    U = exp(-im * H * t)
    return U * ψ₀
end

# Initial state |+⟩
ψ₀ = [1, 1] / √2
ψ_t = time_evolve(ψ₀, 1/4)
println("\\nState at t = T/4: ", ψ_t)`,
  matlab: `% Quantum Mechanics: Quantum Harmonic Oscillator
hbar = 1;
m = 1;
omega = 1;

% Hamiltonian matrix (truncated to N levels)
N = 10;
H = zeros(N);
for n = 0:N-1
    H(n+1, n+1) = hbar * omega * (n + 0.5);
end

% Creation and annihilation operators
a = zeros(N);
for n = 1:N-1
    a(n, n+1) = sqrt(n);
end
a_dag = a';

% Position operator
x = sqrt(hbar / (2 * m * omega)) * (a + a_dag);

% Expectation value of x in ground state
psi0 = zeros(N, 1);
psi0(1) = 1;
x_expect = real(psi0' * x * x' * psi0);
fprintf('⟨0|x²|0⟩ = %.4f\\n', x_expect);`,
  qiskit: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector
import numpy as np

# Create Bell State |Φ+⟩ = (|00⟩ + |11⟩) / √2
qc = QuantumCircuit(2)
qc.h(0)      # Hadamard on qubit 0
qc.cx(0, 1)  # CNOT with control=0, target=1

print("Quantum Circuit:")
print(qc.draw())

# Verify with statevector simulator
sv = Statevector.from_instruction(qc)
print(f"\\nStatevector: {sv}")
print(f"Probabilities: {sv.probabilities_dict()}")

# Run on simulator
sim = AerSimulator()
compiled = transpile(qc, sim)
result = sim.run(compiled, shots=1000).result()
counts = result.get_counts()
print(f"\\nMeasurement results: {counts}")

# Verify correlations
total = sum(counts.values())
p00 = counts.get('00', 0) / total
p11 = counts.get('11', 0) / total
print(f"\\nP(00) = {p00:.3f}")
print(f"P(11) = {p11:.3f}")
print(f"Correlation: {p00 + p11:.3f} ≈ 1.0 ✓")`,
}

export default function CodePage() {
  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState(templates.python)
  const [output, setOutput] = useState("")
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleLanguageChange(lang: string) {
    setLanguage(lang)
    setCode(templates[lang] || "")
    setOutput("")
  }

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const ext = language === "matlab" ? "m" : language === "julia" ? "jl" : "py"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quantum_code.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleRun() {
    setRunning(true)
    setOutput("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setOutput(data.output || data.result || JSON.stringify(data, null, 2))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setOutput(`Error: ${msg}`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px] h-8 text-[12px] bg-white/[0.03] border-white/[0.06]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value} className="text-[12px]">
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="default" className="text-[10px]">
            {languages.find(l => l.value === language)?.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-[12px] text-white/40 hover:text-white/70">
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 text-[12px] text-white/40 hover:text-white/70">
            <Download className="w-3.5 h-3.5 mr-1" />
            Download
          </Button>
          <Button size="sm" onClick={handleRun} disabled={running} className="h-8 text-[12px]">
            {running ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            {running ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      {/* Editor + Output */}
      <div className="flex-1 flex min-h-0">
        {/* Editor */}
        <div className="flex-1 min-w-0">
          <MonacoEditor
            height="100%"
            language={languages.find(l => l.value === language)?.monaco || "python"}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              renderLineHighlight: "line",
              lineNumbers: "on",
              roundedSelection: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              bracketPairColorization: { enabled: true },
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output */}
        <div className="w-[380px] border-l border-white/[0.04] flex flex-col bg-[#0a0f1a]">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04]">
            <Terminal className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[12px] font-medium text-white/50">Output</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {output ? (
              <pre className="text-[12px] font-mono text-white/60 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="text-[12px] text-white/20 italic">
                Run the code to see output...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
