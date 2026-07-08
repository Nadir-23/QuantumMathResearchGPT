"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Download, Plus } from "lucide-react"

const MOCK_DOCS = [
  { name: "VQE Research Notes", type: "Markdown", size: "12 KB", updated: "2 hours ago" },
  { name: "Quantum Error Correction", type: "PDF", size: "2.4 MB", updated: "Yesterday" },
  { name: "Linear Algebra Derivations", type: "Notebook", size: "45 KB", updated: "3 days ago" },
]

export default function DocumentsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Documents</h1>
          <p className="text-sm text-white/40">Research papers, notes, and documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Upload className="w-3 h-3 mr-1" /> Upload</Button>
          <Button size="sm"><Plus className="w-3 h-3 mr-1" /> New</Button>
        </div>
      </div>

      <div className="space-y-2">
        {MOCK_DOCS.map((doc, i) => (
          <Card key={i} className="card-hover cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <FileText className="w-4 h-4 text-white/40" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/70 font-medium">{doc.name}</div>
                <div className="text-xs text-white/30">{doc.type} · {doc.size} · {doc.updated}</div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
