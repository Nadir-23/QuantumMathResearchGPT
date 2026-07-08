"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, Copy, Target, X } from "lucide-react"
import { CircuitGate, GateName, QUBIT_COLORS, QUBIT_STATES, gateColor, PRESETS } from "./types"

interface CircuitDiagramProps {
  circuit: CircuitGate[]
  numQubits: number
  editingGate: string | null
  activePreset: number | null
  onSetCircuit: (circuit: CircuitGate[]) => void
  onSetEditingGate: (id: string | null) => void
  onUpdateGate: (id: string, patch: Partial<CircuitGate>) => void
  onRemoveGate: (id: string) => void
  onLoadPreset: (preset: { name: string; gates: CircuitGate[]; qubits?: number }) => void
  onSetActivePreset: (idx: number | null) => void
}

export default function CircuitDiagram({
  circuit, numQubits, editingGate, activePreset,
  onSetCircuit, onSetEditingGate, onUpdateGate, onRemoveGate, onLoadPreset, onSetActivePreset,
}: CircuitDiagramProps) {
  return (
    <Card className="bg-white/[0.02] border-white/[0.06]">
      <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
        <CardTitle className="text-xs flex items-center gap-2 text-white">
          <Eye className="w-3.5 h-3.5 text-blue-400" /> Circuit Diagram
        </CardTitle>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" className="h-6 text-[10px] text-white/50 hover:text-white px-2" onClick={() => { onSetCircuit([]); onSetEditingGate(null) }}>
            <Trash2 className="w-3 h-3 mr-1" /> Clear
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-[10px] text-white/50 hover:text-white px-2" onClick={() => navigator.clipboard?.writeText(circuit.map((g) => g.name).join(" → "))}>
            <Copy className="w-3 h-3 mr-1" /> Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="rounded-xl bg-[#0a0f1a] border border-white/[0.05] overflow-x-auto">
          {circuit.length === 0 ? (
            <div className="text-center py-12 text-white/15 text-xs">Add gates from the palette above</div>
          ) : (
            <div className="p-4">
              {Array.from({ length: numQubits }).map((_, qi) => {
                const color = QUBIT_COLORS[qi % QUBIT_COLORS.length]
                const stateName = QUBIT_STATES[0].name
                return (
                  <div key={qi} className={`flex items-center min-h-[44px] ${qi < numQubits - 1 ? "mb-1" : ""}`}>
                    <div className="w-16 text-right pr-3 shrink-0">
                      <span className="text-[10px] font-mono leading-none" style={{ color: color + "B0" }}>q[{qi}]</span>
                      <span className="text-[8px] text-white/15 font-mono block leading-none mt-0.5">{stateName}</span>
                    </div>
                    <div className="flex-1 h-px bg-white/10 relative min-w-[300px]">
                      {circuit.map((gate, gi) => {
                        const left = `${(gi + 1) * 56}px`
                        const isControl = gate.control === qi
                        const isTarget = gate.target === qi
                        const isInvolved = isControl || isTarget
                        const isEditing = editingGate === gate.id
                        return (
                          <div key={gate.id} className="absolute top-1/2 -translate-y-1/2" style={{ left }}>
                            {gate.name === "CNOT" && isControl ? (
                              <div className="w-6 h-6 rounded-full border-2 border-pink-400 bg-pink-400/10 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                              </div>
                            ) : gate.name === "CNOT" && isTarget ? (
                              <div className="w-6 h-6 rounded-full border-2 border-pink-400 bg-pink-400/10 flex items-center justify-center text-[11px] text-pink-300 font-mono font-bold">⊕</div>
                            ) : gate.name === "CNOT" ? null : gate.name === "SWAP" && isInvolved ? (
                              <div className="w-6 h-6 flex items-center justify-center text-indigo-400 text-sm font-bold">×</div>
                            ) : gate.name === "M" && isTarget ? (
                              <div className="w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center">
                                <div className="w-3 h-2.5 border border-white/40 rounded-sm relative overflow-hidden">
                                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-white/30 rounded-t-full" />
                                </div>
                              </div>
                            ) : isTarget ? (
                              <button
                                onClick={() => onSetEditingGate(isEditing ? null : gate.id)}
                                className={`w-6 h-6 rounded bg-gradient-to-br ${gateColor(gate.name)} border flex items-center justify-center text-[9px] text-white font-mono font-bold hover:scale-110 transition-transform ${isEditing ? "border-white/60 ring-2 ring-white/30" : "border-white/20"}`}
                              >
                                {gate.name}
                              </button>
                            ) : null}
                            {gate.name === "CNOT" && isControl && gate.target !== qi && (
                              <div className="absolute left-1/2 top-1/2 w-px bg-pink-400/40" style={{ height: `${Math.abs(gate.target - qi) * 44}px`, transform: `translate(-50%, ${gate.target > qi ? "0" : "-100%"})` }} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className="flex items-center mt-2 min-w-max">
                <div className="w-16 shrink-0" />
                <div className="flex gap-2 text-[8px] text-white/15 font-mono">
                  {circuit.map((g, i) => (
                    <span key={g.id} className="w-[56px] text-center">{i + 1}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gate target editor */}
        {editingGate && (() => {
          const g = circuit.find((c) => c.id === editingGate)
          if (!g) return null
          const isTwo = g.name === "CNOT" || g.name === "SWAP"
          return (
            <div className="mt-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-3 h-3 text-cyan-400" />
                <span className="text-[11px] text-white/60">Target qubit for <span className="font-mono text-cyan-400">{g.name}</span> (step {circuit.indexOf(g) + 1})</span>
                <button onClick={() => onSetEditingGate(null)} className="ml-auto text-white/30 hover:text-white/60"><X className="w-3 h-3" /></button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-white/35 uppercase">{isTwo ? "Control" : "Target"}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: numQubits }).map((_, qi) => (
                      <button
                        key={qi}
                        onClick={() => isTwo ? onUpdateGate(g.id, { control: qi }) : onUpdateGate(g.id, { target: qi })}
                        className={`w-7 h-7 rounded text-[10px] font-mono font-bold transition-all border ${
                          (isTwo ? g.control : g.target) === qi
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                            : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/70"
                        }`}
                      >
                        {qi}
                      </button>
                    ))}
                  </div>
                </div>
                {isTwo && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-white/35 uppercase">Target</span>
                    <div className="flex gap-1">
                      {Array.from({ length: numQubits }).map((_, qi) => (
                        <button
                          key={qi}
                          onClick={() => onUpdateGate(g.id, { target: qi })}
                          className={`w-7 h-7 rounded text-[10px] font-mono font-bold transition-all border ${
                            g.target === qi
                              ? "bg-pink-500/20 text-pink-400 border-pink-500/40"
                              : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/70"
                          }`}
                        >
                          {qi}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="h-7 text-[10px] text-red-400/60 hover:text-red-400 px-2" onClick={() => { onRemoveGate(g.id); onSetEditingGate(null) }}>
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          )
        })()}

        {/* Presets */}
        <div className="mt-3">
          <p className="text-[10px] text-white/25 mb-1.5 uppercase tracking-wider">Presets</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => { onLoadPreset(p); onSetActivePreset(i); onSetEditingGate(null) }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] transition-all border ${
                  activePreset === i
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                    : "bg-white/[0.03] text-white/35 border-white/[0.06] hover:text-white/60 hover:border-white/[0.12]"
                }`}
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-white/15 ml-1">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
