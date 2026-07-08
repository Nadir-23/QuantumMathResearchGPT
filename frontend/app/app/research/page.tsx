"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ExternalLink, BookOpen, Plus, Filter } from "lucide-react"

const MOCK_PAPERS = [
  { title: "Variational Quantum Eigensolver with Adaptive Ansatz", authors: "A. Smith, B. Chen", year: 2024, field: "Quantum Computing", citations: 42, abstract: "We present an adaptive variational approach for finding ground state energies of molecular Hamiltonians using quantum circuits." },
  { title: "Topological Quantum Error Correction Codes", authors: "C. Lee, D. Kumar", year: 2025, field: "Quantum Error Correction", citations: 28, abstract: "A novel class of topological codes achieving threshold error rates below 1% for realistic noise models." },
  { title: "Machine Learning for Quantum State Tomography", authors: "E. Wang, F. Rossi", year: 2024, field: "Quantum ML", citations: 67, abstract: "Neural network approaches to efficient quantum state reconstruction with polynomial sample complexity." },
  { title: "Symbolic Computation of Feynman Diagrams", authors: "G. Müller, H. Tanaka", year: 2025, field: "Theoretical Physics", citations: 15, abstract: "Automated symbolic evaluation of multi-loop Feynman integrals using differential equation methods." },
]

export default function ResearchPage() {
  const [query, setQuery] = useState("")
  const [papers, setPapers] = useState(MOCK_PAPERS)
  const [filter, setFilter] = useState("all")

  const filtered = papers.filter((p) => {
    if (filter !== "all" && p.field !== filter) return false
    if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.authors.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Research</h1>
        <p className="text-sm text-white/40">Search ArXiv papers, literature, and research gaps</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search papers, topics, authors..." className="pl-10" />
        </div>
        <Button><Search className="w-4 h-4 mr-2" /> Search</Button>
      </div>

      <div className="flex gap-2">
        {["all", "Quantum Computing", "Quantum ML", "Quantum Error Correction", "Theoretical Physics"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filter === f ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/70"}`}>
            {f === "all" ? "All Fields" : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((paper, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-white mb-1">{paper.title}</h3>
                  <p className="text-xs text-white/40 mb-2">{paper.authors} · {paper.year}</p>
                  <p className="text-[13px] text-white/50 leading-relaxed mb-3">{paper.abstract}</p>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-[10px]">{paper.field}</Badge>
                    <span className="text-[11px] text-white/30">{paper.citations} citations</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button variant="secondary" size="sm" className="text-[11px]"><ExternalLink className="w-3 h-3 mr-1" /> PDF</Button>
                  <Button variant="secondary" size="sm" className="text-[11px]"><BookOpen className="w-3 h-3 mr-1" /> Summarize</Button>
                  <Button variant="ghost" size="sm" className="text-[11px]"><Plus className="w-3 h-3 mr-1" /> Workspace</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
