"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Grid3X3 } from "lucide-react"

interface DensityMatrixProps {
  numQubits: number
  basisStates: string[]
}

export default function DensityMatrix({ numQubits, basisStates }: DensityMatrixProps) {
  const dim = Math.pow(2, numQubits)
  const matrix: string[][] = []
  for (let i = 0; i < dim; i++) {
    const row: string[] = []
    for (let j = 0; j < dim; j++) {
      if (i === j) row.push((1 / dim).toFixed(3))
      else row.push("0.000")
    }
    matrix.push(row)
  }

  return (
    <Card className="bg-white/[0.02] border-white/[0.06]">
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-xs flex items-center gap-2 text-white">
          <Grid3X3 className="w-3.5 h-3.5 text-purple-400" /> Density Matrix ρ
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4">
          <div className="max-w-lg mx-auto">
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${dim}, 1fr)` }}>
              {matrix.map((row, i) =>
                row.map((val, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="aspect-square rounded flex items-center justify-center text-[9px] font-mono border border-white/[0.05]"
                    style={{
                      background: val !== "0.000" ? `rgba(59, 130, 246, ${parseFloat(val) * 0.8})` : "rgba(255,255,255,0.02)",
                      color: val !== "0.000" ? "#93c5fd" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[8px] text-white/15 font-mono">
              {basisStates.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
          <Separator className="bg-white/[0.06]" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[9px] text-white/25 uppercase mb-0.5">Tr(ρ²)</div>
              <div className="text-base font-mono font-bold text-white/60">{(1 / dim).toFixed(3)}</div>
            </div>
            <div>
              <div className="text-[9px] text-white/25 uppercase mb-0.5">Purity</div>
              <div className="text-base font-mono font-bold text-emerald-400">Mixed</div>
            </div>
            <div>
              <div className="text-[9px] text-white/25 uppercase mb-0.5">Von Neumann S</div>
              <div className="text-base font-mono font-bold text-cyan-400">{Math.log2(dim).toFixed(3)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
