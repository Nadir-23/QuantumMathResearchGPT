"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FlaskConical, Code2, BookOpen, Cpu, Activity } from "lucide-react"

const stats = [
  { icon: Calculator, label: "Questions Solved", value: "1,247", change: "+23%", color: "text-blue-400" },
  { icon: FlaskConical, label: "Quantum Simulations", value: "384", change: "+12%", color: "text-purple-400" },
  { icon: Code2, label: "Code Generated", value: "89", change: "+8%", color: "text-cyan-400" },
  { icon: BookOpen, label: "Papers Analyzed", value: "156", change: "+31%", color: "text-emerald-400" },
  { icon: Cpu, label: "Tokens Used", value: "2.4M", change: "+18%", color: "text-amber-400" },
  { icon: Activity, label: "Sessions", value: "67", change: "+5%", color: "text-rose-400" },
]

const recentActivity = [
  { action: "Solved differential equation", agent: "Math Agent", time: "2 min ago" },
  { action: "Simulated Bell state circuit", agent: "Quantum Agent", time: "15 min ago" },
  { action: "Analyzed ArXiv paper on VQE", agent: "Research Agent", time: "1 hr ago" },
  { action: "Generated Qiskit circuit code", agent: "Code Agent", time: "2 hr ago" },
  { action: "Verified matrix eigenvalues", agent: "Verification Agent", time: "3 hr ago" },
]

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-white/40">Overview of your scientific research activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-[11px] text-emerald-400 font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[12px] text-white/40">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-blue-600/40 to-purple-600/40 rounded-t-lg" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-white/30">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02]">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <div className="text-[13px] text-white/70">{activity.action}</div>
                    <div className="text-[11px] text-white/30">{activity.agent} · {activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
