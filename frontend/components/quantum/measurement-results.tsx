"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface Measurement {
  state: string
  probability: number
  amplitude: string
}

interface MeasurementResultsProps {
  measurements: Measurement[]
  numQubits: number
  basisStates: string[]
}

export default function MeasurementResults({ measurements, numQubits, basisStates }: MeasurementResultsProps) {
  return (
    <Card className="bg-white/[0.02] border-white/[0.06]">
      <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
        <CardTitle className="text-xs flex items-center gap-2 text-white">
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Measurement Results
        </CardTitle>
        <span className="text-[9px] text-white/20 font-mono">1024 shots · {basisStates.length} states</span>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {measurements.length === 0 ? (
          <div className="text-center py-10 text-white/15 text-xs">Run a simulation to see measurement results</div>
        ) : (
          <div className={`grid gap-2.5 ${numQubits <= 3 ? "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8" : "grid-cols-2 sm:grid-cols-4"}`}>
            {measurements.map((m) => (
              <div key={m.state} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/60">{m.state}</span>
                  <span className="text-[9px] font-mono text-white/30">{m.probability}%</span>
                </div>
                <div className="h-24 rounded-lg bg-white/[0.02] border border-white/[0.05] overflow-hidden relative">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/40 to-blue-500/20 rounded-t transition-all duration-700"
                    style={{ height: `${m.probability}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-white/40 font-medium">{m.amplitude}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
