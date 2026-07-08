"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Sigma, Play, Zap, ArrowRight } from "lucide-react"

interface HamiltonianEditorProps {
  hamiltonian: string
  numQubits: number
  onSetHamiltonian: (value: string) => void
}

export default function HamiltonianEditor({ hamiltonian, numQubits, onSetHamiltonian }: HamiltonianEditorProps) {
  return (
    <Card className="bg-white/[0.02] border-white/[0.06]">
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-xs flex items-center gap-2 text-white">
          <Sigma className="w-3.5 h-3.5 text-amber-400" /> Hamiltonian Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5">
        <Textarea
          value={hamiltonian}
          onChange={(e) => onSetHamiltonian(e.target.value)}
          className="font-mono text-xs bg-[#0a0f1a] border-white/[0.06] min-h-[100px] text-white/80 resize-none"
          placeholder="Enter Hamiltonian expression..."
        />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="h-7 text-[10px] px-3"><Play className="w-3 h-3 mr-1" /> Diagonalize</Button>
          <Button variant="secondary" size="sm" className="h-7 text-[10px] px-3"><Zap className="w-3 h-3 mr-1" /> Ground State</Button>
          <Button variant="secondary" size="sm" className="h-7 text-[10px] px-3"><ArrowRight className="w-3 h-3 mr-1" /> Time Evolution</Button>
        </div>
        <Separator className="bg-white/[0.06]" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="text-[10px] text-white/35">Energy Eigenvalues</p>
            <div className="space-y-1 font-mono text-[10px]">
              {Array.from({ length: Math.pow(2, numQubits) }, (_, i) => (
                <div key={i} className="px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/[0.05] text-white/50">
                  E{i} = {(-Math.pow(2, numQubits) + 1 + i * 2).toFixed(3)}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] text-white/35">Ground State Energy</p>
            <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-center">
              <div className="text-xl font-bold text-cyan-400 font-mono">{(-Math.pow(2, numQubits) + 1).toFixed(3)}</div>
              <div className="text-[9px] text-white/25 mt-0.5">Ha</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
