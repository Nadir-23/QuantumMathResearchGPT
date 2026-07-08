"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

interface BlochSphereProps {
  theta?: number
  phi?: number
  size?: number
}

export default function BlochSphere({ theta = 0, phi = 0, size = 200 }: BlochSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0.3, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = size * 0.38

    ctx.clearRect(0, 0, size, size)

    // Draw sphere outline
    ctx.strokeStyle = "rgba(255,255,255,0.08)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()

    // Draw equator
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(79, 124, 255, 0.15)"
    ctx.stroke()

    // Draw meridian
    ctx.beginPath()
    ctx.ellipse(cx, cy, r * 0.3, r, 0, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(124, 58, 237, 0.15)"
    ctx.stroke()

    // Draw axes
    ctx.strokeStyle = "rgba(255,255,255,0.15)"
    ctx.lineWidth = 0.5
    // Z axis
    ctx.beginPath()
    ctx.moveTo(cx, cy - r - 10)
    ctx.lineTo(cx, cy + r + 10)
    ctx.stroke()
    // X axis
    ctx.beginPath()
    ctx.moveTo(cx - r - 10, cy)
    ctx.lineTo(cx + r + 10, cy)
    ctx.stroke()

    // Labels
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.font = "10px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("|0⟩", cx, cy - r - 14)
    ctx.fillText("|1⟩", cx, cy + r + 18)
    ctx.fillText("|+⟩", cx + r + 14, cy + 4)
    ctx.fillText("|−⟩", cx - r - 14, cy + 4)

    // Calculate Bloch vector position
    const bx = Math.sin(theta) * Math.cos(phi)
    const by = Math.sin(theta) * Math.sin(phi)
    const bz = Math.cos(theta)

    // Project to 2D
    const projX = cx + r * (bx * Math.cos(rotation.y) - by * Math.sin(rotation.y))
    const projY = cy - r * (bz * Math.cos(rotation.x) - (bx * Math.sin(rotation.y) + by * Math.cos(rotation.y)) * Math.sin(rotation.x))

    // Draw vector line
    const gradient = ctx.createLinearGradient(cx, cy, projX, projY)
    gradient.addColorStop(0, "rgba(79, 124, 255, 0.3)")
    gradient.addColorStop(1, "rgba(0, 212, 255, 1)")
    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(projX, projY)
    ctx.stroke()

    // Draw point
    ctx.beginPath()
    ctx.arc(projX, projY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#00D4FF"
    ctx.fill()
    ctx.strokeStyle = "rgba(0, 212, 255, 0.5)"
    ctx.lineWidth = 6
    ctx.stroke()

    // Glow effect
    const glowGradient = ctx.createRadialGradient(projX, projY, 0, projX, projY, 20)
    glowGradient.addColorStop(0, "rgba(0, 212, 255, 0.3)")
    glowGradient.addColorStop(1, "rgba(0, 212, 255, 0)")
    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(projX, projY, 20, 0, Math.PI * 2)
    ctx.fill()
  }, [theta, phi, size, rotation])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center"
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          const startX = e.clientX
          const startY = e.clientY
          const startRot = { ...rotation }

          const handleMove = (e: MouseEvent) => {
            const dx = (e.clientX - startX) * 0.01
            const dy = (e.clientY - startY) * 0.01
            setRotation({ x: startRot.x + dy, y: startRot.y + dx })
          }
          const handleUp = () => {
            window.removeEventListener("mousemove", handleMove)
            window.removeEventListener("mouseup", handleUp)
          }
          window.addEventListener("mousemove", handleMove)
          window.addEventListener("mouseup", handleUp)
        }}
      />
      <div className="flex gap-4 mt-2 text-[11px] text-white/40 font-mono">
        <span>θ = {((theta * 180) / Math.PI).toFixed(1)}°</span>
        <span>φ = {((phi * 180) / Math.PI).toFixed(1)}°</span>
      </div>
    </motion.div>
  )
}
