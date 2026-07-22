"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Atom, Play, RotateCcw, Download, Sparkles, CircleDot } from "lucide-react"
import { motion } from "framer-motion"

import BlochSphere from "@/components/quantum/bloch-sphere"
import GatePalette from "@/components/quantum/gate-palette"
import CircuitDiagram from "@/components/quantum/circuit-diagram"
import QubitConfig from "@/components/quantum/qubit-config"
import MeasurementResults from "@/components/quantum/measurement-results"
import DensityMatrix from "@/components/quantum/density-matrix"
import HamiltonianEditor from "@/components/quantum/hamiltonian-editor"
import {
  CircuitGate, GateName, QUBIT_STATES, QUBIT_COLORS, applyGate, PRESETS,
} from "@/components/quantum/types"

export default function QuantumPage() {
  const [numQubits, setNumQubits] = useState(2)
  const [qubitStates, setQubitStates] = useState<number[]>([0, 0])
  const [selectedQubit, setSelectedQubit] = useState(0)
  const [circuit, setCircuit] = useState<CircuitGate[]>([
    { id: "g1", name: "H", target: 0 },
    { id: "g2", name: "CNOT", target: 1, control: 0 },
  ])
  const [hamiltonian, setHamiltonian] = useState("H = -J * (Z₁Z₂ + Z₂Z₃) - h * (X₁ + X₂ + X₃)")
  const [measurements, setMeasurements] = useState<{ state: string; probability: number; amplitude: string }[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [activePreset, setActivePreset] = useState<number | null>(0)
  const [editingGate, setEditingGate] = useState<string | null>(null)

  const gateId = useRef(3)

  useEffect(() => {
    setQubitStates((prev) => {
      const next = [...prev]
      while (next.length < numQubits) next.push(0)
      return next.slice(0, numQubits)
    })
    setCircuit((prev) => prev.map((g) => ({
      ...g,
      target: Math.min(g.target, numQubits - 1),
      control: g.control !== undefined ? Math.min(g.control, numQubits - 1) : undefined,
    })))
    if (selectedQubit >= numQubits) setSelectedQubit(0)
  }, [numQubits, selectedQubit])

  const selectedTheta = QUBIT_STATES[qubitStates[selectedQubit]]?.theta ?? 0
  const selectedPhi = QUBIT_STATES[qubitStates[selectedQubit]]?.phi ?? 0
  const selectedColor = QUBIT_COLORS[selectedQubit % QUBIT_COLORS.length]
  const selectedLabel = `q[${selectedQubit}]`

  const basisStates = useMemo(() => {
    const count = Math.pow(2, numQubits)
    return Array.from({ length: count }, (_, i) => `|${i.toString(2).padStart(numQubits, "0")}⟩`)
  }, [numQubits])

  const finalAngles = useMemo(() => {
    const angles = qubitStates.map((si) => ({ theta: QUBIT_STATES[si].theta, phi: QUBIT_STATES[si].phi }))
    for (const g of circuit) {
      if (g.name === "CNOT" || g.name === "SWAP") continue
      const a = angles[g.target]
      if (a) angles[g.target] = applyGate(g.name, a.theta, a.phi)
    }
    return angles
  }, [qubitStates, circuit])

  function computeMeasurements() {
    const numStates = Math.pow(2, numQubits)
    const probs = Array(numStates).fill(0)
    const hasH = circuit.some((g) => g.name === "H")
    const hasCNOT = circuit.some((g) => g.name === "CNOT")
    const hasX = circuit.some((g) => g.name === "X")

    if (hasH && hasCNOT && numQubits >= 2) {
      const cnot = circuit.find((g) => g.name === "CNOT")!
      const ctrl = cnot.control ?? 0
      const tgt = cnot.target
      probs[0] = 48
      const flipIdx = (1 << (numQubits - 1 - ctrl)) | (1 << (numQubits - 1 - tgt))
      probs[flipIdx] = 48
      for (let i = 0; i < numStates; i++) if (probs[i] === 0) probs[i] = Math.random() * 2
    } else if (hasH) {
      for (let i = 0; i < numStates; i++) probs[i] = 100 / numStates
    } else if (hasX) {
      let idx = 0
      for (const g of circuit) if (g.name === "X") idx |= (1 << (numQubits - 1 - g.target))
      probs[idx] = 85
      for (let i = 0; i < numStates; i++) if (probs[i] === 0) probs[i] = Math.random() * 2
    } else {
      let idx = 0
      for (let i = 0; i < numQubits; i++) if (qubitStates[i] === 1) idx |= (1 << (numQubits - 1 - i))
      probs[idx] = 88
      for (let i = 0; i < numStates; i++) if (probs[i] === 0) probs[i] = Math.random() * 2
    }

    const sum = probs.reduce((a, b) => a + b, 0)
    return basisStates.map((state, i) => ({
      state,
      probability: +(probs[i] / sum * 100).toFixed(1),
      amplitude: Math.sqrt(Math.max(0, probs[i] / sum)).toFixed(3),
    }))
  }

  function simulate() {
    setIsRunning(true)
    setTimeout(() => {
      setMeasurements(computeMeasurements())
      setIsRunning(false)
    }, 700)
  }

  function addGate(gate: GateName) {
    const isTwo = gate === "CNOT" || gate === "SWAP"
    const newGate: CircuitGate = {
      id: `g${gateId.current++}`,
      name: gate,
      target: 0,
      control: isTwo ? (numQubits > 1 ? 1 : 0) : undefined,
    }
    setCircuit((prev) => [...prev, newGate])
    setEditingGate(newGate.id)
  }

  function updateGate(id: string, patch: Partial<CircuitGate>) {
    setCircuit((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  }

  function removeGate(id: string) {
    setCircuit((prev) => prev.filter((g) => g.id !== id))
  }

  function setQubitState(qubitIdx: number, stateIdx: number) {
    setQubitStates((prev) => {
      const next = [...prev]
      next[qubitIdx] = stateIdx
      return next
    })
  }

  function resetQubits() {
    setQubitStates(Array(numQubits).fill(0))
    setCircuit([])
    setMeasurements([])
    setActivePreset(null)
    setEditingGate(null)
  }

  function loadPreset(preset: { name: string; gates: CircuitGate[]; qubits?: number }) {
    if (preset.qubits) setNumQubits(preset.qubits)
    if (preset.qubits) setQubitStates(Array(preset.qubits).fill(0))
    setCircuit(preset.gates)
    setMeasurements([])
  }

  return (
    <div className="px-4 py-5 md:px-6 lg:px-8 max-w-[1600px] mx-auto">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Atom className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">Quantum Computing Lab</h1>
            <p className="text-xs text-white/30">Design circuits, target gates to specific qubits, simulate quantum systems</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-[10px] px-2.5 py-1 bg-cyan-500/15 text-cyan-400 border-cyan-500/25">{numQubits} Qubit{numQubits > 1 ? "s" : ""}</Badge>
          <Badge variant="default" className="text-[10px] px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border-emerald-500/25">Ready</Badge>
        </div>
      </motion.div>

      {/* ── Qubit Config ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-4">
        <QubitConfig
          numQubits={numQubits}
          qubitStates={qubitStates}
          selectedQubit={selectedQubit}
          onSetNumQubits={setNumQubits}
          onSetSelectedQubit={setSelectedQubit}
          onSetQubitState={setQubitState}
        />
      </motion.div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="circuit" className="space-y-4">
        <TabsList className="bg-white/[0.03] border border-white/[0.06] p-1 h-9">
          <TabsTrigger value="circuit" className="data-[state=active]:bg-white/10 px-4 py-1.5 text-xs">Circuit</TabsTrigger>
          <TabsTrigger value="hamiltonian" className="data-[state=active]:bg-white/10 px-4 py-1.5 text-xs">Hamiltonian</TabsTrigger>
          <TabsTrigger value="density" className="data-[state=active]:bg-white/10 px-4 py-1.5 text-xs">Density Matrix</TabsTrigger>
        </TabsList>

        {/* ════════════ Circuit Tab ════════════ */}
        <TabsContent value="circuit">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">

            {/* ─── Left: Gate Palette + Circuit + Actions ─── */}
            <div className="flex flex-col gap-4 min-w-0">

              {/* Gate Palette */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <GatePalette onAddGate={addGate} />
              </motion.div>

              {/* Circuit Diagram */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex-1 min-h-0">
                <CircuitDiagram
                  circuit={circuit}
                  numQubits={numQubits}
                  editingGate={editingGate}
                  activePreset={activePreset}
                  onSetCircuit={setCircuit}
                  onSetEditingGate={setEditingGate}
                  onUpdateGate={updateGate}
                  onRemoveGate={removeGate}
                  onLoadPreset={loadPreset}
                  onSetActivePreset={setActivePreset}
                />
              </motion.div>

              {/* Action Bar */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <Button onClick={simulate} disabled={isRunning} size="sm" className="h-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs px-4">
                  {isRunning ? (
                    <><Sparkles className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Simulating...</>
                  ) : (
                    <><Play className="w-3.5 h-3.5 mr-1.5" /> Run Simulation</>
                  )}
                </Button>
                <Button variant="secondary" size="sm" onClick={resetQubits} className="h-8 text-xs px-3">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
                </Button>
                <Button variant="secondary" size="sm" className="h-8 text-xs px-3">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Export
                </Button>
                <div className="flex-1" />
                <span className="text-[10px] text-white/20 font-mono">{circuit.length} gates · {numQubits} qubits</span>
              </motion.div>

              {/* Measurement Results */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <MeasurementResults measurements={measurements} numQubits={numQubits} basisStates={basisStates} />
              </motion.div>
            </div>

            {/* ─── Right Column: Bloch Sphere + Qubit States ─── */}
            <div className="flex flex-col gap-4">

              {/* Bloch Sphere — tall card */}
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <Card className="bg-white/[0.02] border-white/[0.06] overflow-hidden">
                  <CardHeader className="pb-0 pt-4 px-5">
                    <CardTitle className="text-xs flex items-center gap-2 text-white">
                      <Atom className="w-3.5 h-3.5 text-purple-400" /> Bloch Sphere
                      <span className="ml-auto text-[10px] font-mono" style={{ color: selectedColor }}>{selectedLabel}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center px-5 pt-2 pb-5">
                    <div className="w-full aspect-square max-w-[300px] mx-auto">
                      <BlochSphere
                        theta={selectedTheta}
                        phi={selectedPhi}
                        qubitLabel={selectedLabel}
                        qubitColor={selectedColor}
                      />
                    </div>
                    <div className="mt-2 text-center space-y-1">
                      <div>
                        <span className="text-[11px] font-mono text-white/40">State: </span>
                        <span className="text-[11px] font-mono font-semibold" style={{ color: selectedColor }}>
                          {QUBIT_STATES[qubitStates[selectedQubit]].name}
                        </span>
                        <span className="text-[10px] text-white/20 ml-1.5">
                          ({QUBIT_STATES[qubitStates[selectedQubit]].label})
                        </span>
                      </div>
                      <div className="text-[10px] text-white/20 font-mono">
                        θ={((finalAngles[selectedQubit]?.theta ?? 0) * 180 / Math.PI).toFixed(0)}°
                        &nbsp;φ={((finalAngles[selectedQubit]?.phi ?? 0) * 180 / Math.PI).toFixed(0)}°
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Qubit States — compact list */}
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-white/[0.02] border-white/[0.06]">
                  <CardHeader className="pb-2 pt-3.5 px-5">
                    <CardTitle className="text-xs flex items-center gap-2 text-white">
                      <CircleDot className="w-3.5 h-3.5 text-blue-400" /> Qubit States
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="space-y-1.5">
                      {Array.from({ length: numQubits }).map((_, qi) => {
                        const state = QUBIT_STATES[qubitStates[qi]]
                        const color = QUBIT_COLORS[qi % QUBIT_COLORS.length]
                        const final = finalAngles[qi]
                        return (
                          <div key={qi} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-[11px] font-mono text-white/50 w-7">q[{qi}]</span>
                            <span className="text-[11px] font-mono font-medium" style={{ color }}>{state.name}</span>
                            <span className="text-[9px] text-white/20 ml-auto font-mono">
                              θ{((final?.theta ?? 0) * 180 / Math.PI).toFixed(0)}° φ{((final?.phi ?? 0) * 180 / Math.PI).toFixed(0)}°
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <Separator className="bg-white/[0.06] my-3" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-center">
                        <div className="text-[9px] text-white/20 uppercase tracking-wider">Fidelity</div>
                        <div className="text-[11px] font-mono text-emerald-400 font-semibold">100%</div>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-center">
                        <div className="text-[9px] text-white/20 uppercase tracking-wider">Purity</div>
                        <div className="text-[11px] font-mono text-cyan-400 font-semibold">1.000</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* ════════════ Hamiltonian Tab ════════════ */}
        <TabsContent value="hamiltonian">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <HamiltonianEditor hamiltonian={hamiltonian} numQubits={numQubits} onSetHamiltonian={setHamiltonian} />
          </motion.div>
        </TabsContent>

        {/* ════════════ Density Matrix Tab ════════════ */}
        <TabsContent value="density">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <DensityMatrix numQubits={numQubits} basisStates={basisStates} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
