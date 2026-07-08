"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import { GATE_PALETTE, GateName } from "./types"

interface GatePaletteProps {
  onAddGate: (gate: GateName) => void
}

export default function GatePalette({ onAddGate }: GatePaletteProps) {
  return (
    <Card className="bg-white/[0.02] border-white/[0.06]">
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-xs flex items-center gap-2 text-white">
          <Zap className="w-3.5 h-3.5 text-cyan-400" /> Gate Palette
          <span className="ml-auto text-[9px] text-white/25 font-normal">Click to add, then set target qubit</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-9 gap-2">
          {GATE_PALETTE.map((gate) => (
            <button
              key={gate.name}
              onClick={() => onAddGate(gate.name)}
              className="group flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-200"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gate.color} flex items-center justify-center text-white font-mono text-xs font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                {gate.name}
              </div>
              <span className="text-[8px] text-white/25 group-hover:text-white/40 transition-colors">{gate.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
