"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Settings2 } from "lucide-react"
import { QUBIT_STATES, QUBIT_COLORS } from "./types"

interface QubitConfigProps {
  numQubits: number
  qubitStates: number[]
  selectedQubit: number
  onSetNumQubits: (n: number) => void
  onSetSelectedQubit: (q: number) => void
  onSetQubitState: (qubitIdx: number, stateIdx: number) => void
}

export default function QubitConfig({
  numQubits, qubitStates, selectedQubit,
  onSetNumQubits, onSetSelectedQubit, onSetQubitState,
}: QubitConfigProps) {
  return (
    <Card className="bg-white/[0.02] border-white/[0.06]">
      <CardHeader className="pb-3 pt-4 px-5">
        <CardTitle className="text-sm flex items-center gap-2 text-white">
          <Settings2 className="w-4 h-4 text-cyan-400" /> Qubit Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-xs text-white/40 shrink-0">Number of Qubits</label>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => onSetNumQubits(n)}
                className={`w-10 h-10 rounded-lg text-sm font-mono font-bold transition-all border ${
                  numQubits === n
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                    : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/70 hover:border-white/[0.12]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-white/20 font-mono">{Math.pow(2, numQubits)} basis states</span>
        </div>

        <Separator className="bg-white/[0.06]" />

        <div>
          <label className="text-xs text-white/40 mb-3 block">Initial State per Qubit — click a qubit card to edit, then pick a state</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {Array.from({ length: numQubits }).map((_, qi) => {
              const stateIdx = qubitStates[qi]
              const state = QUBIT_STATES[stateIdx]
              const color = QUBIT_COLORS[qi % QUBIT_COLORS.length]
              const isSelected = selectedQubit === qi
              return (
                <div
                  key={qi}
                  onClick={() => onSetSelectedQubit(qi)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-white/20 bg-white/[0.06]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                  }`}
                  style={isSelected ? { boxShadow: `0 0 0 1px ${color}40` } : undefined}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-mono font-bold" style={{ color }}>q[{qi}]</span>
                    {isSelected && <span className="text-[9px] text-white/30 ml-auto">editing</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUBIT_STATES.map((s, si) => (
                      <button
                        key={si}
                        onClick={(e) => { e.stopPropagation(); onSetQubitState(qi, si); onSetSelectedQubit(qi) }}
                        className={`px-2.5 py-1.5 rounded text-[10px] font-mono transition-all border ${
                          stateIdx === si
                            ? "border-white/20 text-white bg-white/10"
                            : "border-white/[0.04] text-white/30 hover:text-white/60 hover:border-white/[0.1]"
                        }`}
                        title={s.label}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2.5 text-[10px] text-white/25 font-mono">
                    θ={((state.theta * 180) / Math.PI).toFixed(0)}° φ={((state.phi * 180) / Math.PI).toFixed(0)}°
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
