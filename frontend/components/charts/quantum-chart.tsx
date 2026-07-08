"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { motion } from "framer-motion"

interface ChartData {
  time: number
  probability: number
  label?: string
}

interface QuantumChartProps {
  data: ChartData[]
  title: string
  color?: string
  yLabel?: string
}

export function QuantumChart({ data, title, color = "#4F7CFF", yLabel = "Probability" }: QuantumChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[18px] border border-white/[0.06] bg-[#111827]/80 p-4"
    >
      <h4 className="text-[13px] font-semibold text-white mb-3">{title}</h4>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              tickLine={false}
              domain={[0, 1]}
            />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "rgba(255,255,255,0.5)" }}
              itemStyle={{ color }}
            />
            <Area
              type="monotone"
              dataKey="probability"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color.replace("#", "")})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {yLabel && (
        <div className="text-[10px] text-white/30 text-center mt-2">{yLabel}</div>
      )}
    </motion.div>
  )
}

export function ProbabilityChart() {
  const data = Array.from({ length: 50 }, (_, i) => ({
    time: i * 0.1,
    probability: Math.cos(i * 0.15) ** 2,
  }))

  return (
    <QuantumChart
      data={data}
      title="Population Evolution"
      color="#4F7CFF"
      yLabel="P(|0⟩)"
    />
  )
}

export function ExpectationChart() {
  const data = Array.from({ length: 50 }, (_, i) => ({
    time: i * 0.1,
    probability: Math.sin(i * 0.2) * 0.5 + 0.5,
  }))

  return (
    <QuantumChart
      data={data}
      title="Expectation Value ⟨σ_x⟩"
      color="#7C3AED"
      yLabel="⟨σ_x⟩"
    />
  )
}
