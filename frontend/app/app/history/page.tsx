"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, MessageSquare, Trash2 } from "lucide-react"

const MOCK_HISTORY = [
  { title: "Solving cubic equations", messages: 12, time: "2 hours ago" },
  { title: "Bell state circuit simulation", messages: 8, time: "Yesterday" },
  { title: "Schrödinger equation derivation", messages: 15, time: "2 days ago" },
  { title: "ArXiv paper review on VQE", messages: 6, time: "3 days ago" },
  { title: "Matrix eigenvalue verification", messages: 10, time: "1 week ago" },
]

export default function HistoryPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">History</h1>
        <p className="text-sm text-white/40">Your past conversations and sessions</p>
      </div>

      <div className="space-y-2">
        {MOCK_HISTORY.map((item, i) => (
          <Card key={i} className="card-hover cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white/40" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/70 font-medium">{item.title}</div>
                <div className="text-xs text-white/30">{item.messages} messages · {item.time}</div>
              </div>
              <button className="text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
