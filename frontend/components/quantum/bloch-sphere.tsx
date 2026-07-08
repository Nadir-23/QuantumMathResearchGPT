"use client"

import { useRef, useEffect } from "react"

interface BlochSphereProps {
  theta: number
  phi: number
  qubitLabel: string
  qubitColor: string
  size?: number
}

export default function BlochSphere({ theta, phi, qubitLabel, qubitColor, size = 260 }: BlochSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetRef = useRef({ theta, phi })
  const animRef = useRef({ theta: 0, phi: 0, rotY: 0, rotX: 0.3 })
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0, userRotY: 0, userRotX: 0.3, autoRot: 0 })

  useEffect(() => { targetRef.current = { theta, phi } }, [theta, phi])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const center = size / 2
    const radius = size * 0.35
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = size + "px"
    canvas.style.height = size + "px"
    ctx.scale(dpr, dpr)

    let raf = 0
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const project = (x: number, y: number, z: number, rotY: number, rotX: number) => {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
      const x1 = x * cosY + z * sinY
      const z1 = -x * sinY + z * cosY
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
      const y2 = y * cosX - z1 * sinX
      const z2 = y * sinX + z1 * cosX
      const sx = center + x1 * radius
      const sy = center - y2 * radius
      return { x: sx, y: sy, depth: z2 }
    }

    const drawCircle = (pts: { x: number; y: number; depth: number }[], stroke: string, lw: number) => {
      ctx.beginPath()
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
      ctx.closePath()
      ctx.strokeStyle = stroke
      ctx.lineWidth = lw
      ctx.stroke()
    }

    const draw = () => {
      const st = animRef.current
      const drag = dragRef.current
      st.theta = lerp(st.theta, targetRef.current.theta, 0.08)
      st.phi = lerp(st.phi, targetRef.current.phi, 0.08)
      if (!drag.dragging) drag.autoRot += 0.004
      st.rotY = lerp(st.rotY, drag.userRotY + drag.autoRot, drag.dragging ? 0.3 : 0.1)
      st.rotX = lerp(st.rotX, drag.userRotX, drag.dragging ? 0.3 : 0.1)
      const rotY = st.rotY
      const rotX = st.rotX

      ctx.clearRect(0, 0, size, size)

      // Sphere outline
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255,255,255,0.10)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Latitude lines
      for (let i = 1; i < 6; i++) {
        const lat = (i / 6) * Math.PI - Math.PI / 2
        const y = Math.sin(lat)
        const r = Math.cos(lat)
        const pts: { x: number; y: number; depth: number }[] = []
        for (let a = 0; a <= 64; a++) {
          const ang = (a / 64) * Math.PI * 2
          pts.push(project(r * Math.cos(ang), y, r * Math.sin(ang), rotY, rotX))
        }
        const isEquator = Math.abs(lat) < 0.01
        drawCircle(pts, isEquator ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)", isEquator ? 1 : 0.6)
      }

      // Longitude lines
      for (let i = 0; i < 6; i++) {
        const lon = (i / 6) * Math.PI * 2
        const pts: { x: number; y: number; depth: number }[] = []
        for (let a = 0; a <= 64; a++) {
          const ang = (a / 64) * Math.PI - Math.PI / 2
          pts.push(project(Math.cos(ang) * Math.cos(lon), Math.sin(ang), Math.cos(ang) * Math.sin(lon), rotY, rotX))
        }
        drawCircle(pts, "rgba(255,255,255,0.05)", 0.6)
      }

      // Axes
      const axes = [
        { x: 0, y: 1, z: 0, label: "|0⟩", color: "#60A5FA" },
        { x: 0, y: -1, z: 0, label: "|1⟩", color: "#A78BFA" },
        { x: 1, y: 0, z: 0, label: "|+⟩", color: "#22D3EE" },
        { x: -1, y: 0, z: 0, label: "|−⟩", color: "#34D399" },
        { x: 0, y: 0, z: 1, label: "|+i⟩", color: "#FBBF24" },
        { x: 0, y: 0, z: -1, label: "|−i⟩", color: "#FB7185" },
      ]
      axes.forEach((a) => {
        const p = project(a.x, a.y, a.z, rotY, rotX)
        ctx.beginPath()
        ctx.moveTo(center, center)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = "rgba(255,255,255,0.08)"
        ctx.lineWidth = 0.5
        ctx.stroke()
        ctx.fillStyle = a.color
        ctx.font = "9px 'JetBrains Mono', monospace"
        ctx.textAlign = "center"
        ctx.fillText(a.label, p.x, p.y + 3)
      })

      // Bloch vector
      const vx = Math.sin(st.theta) * Math.cos(st.phi)
      const vy = Math.cos(st.theta)
      const vz = Math.sin(st.theta) * Math.sin(st.phi)
      const tip = project(vx, vy, vz, rotY, rotX)

      // Shadow on equatorial plane
      const shadow = project(vx, 0, vz, rotY, rotX)
      ctx.beginPath()
      ctx.ellipse(shadow.x, shadow.y, 5, 2.5, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0,0,0,0.35)"
      ctx.fill()

      // Vector line
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.lineTo(tip.x, tip.y)
      ctx.strokeStyle = qubitColor
      ctx.lineWidth = 2.5
      ctx.shadowColor = qubitColor
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.shadowBlur = 0

      // Tip glow
      const grad = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 12)
      grad.addColorStop(0, qubitColor + "CC")
      grad.addColorStop(1, qubitColor + "00")
      ctx.beginPath()
      ctx.arc(tip.x, tip.y, 12, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Tip dot
      ctx.beginPath()
      ctx.arc(tip.x, tip.y, 4.5, 0, Math.PI * 2)
      ctx.fillStyle = qubitColor
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Label
      ctx.fillStyle = "#fff"
      ctx.font = "bold 10px 'JetBrains Mono', monospace"
      ctx.textAlign = "left"
      ctx.fillText(qubitLabel, tip.x + 10, tip.y - 8)

      // Readout
      ctx.fillStyle = "rgba(255,255,255,0.35)"
      ctx.font = "8px 'JetBrains Mono', monospace"
      ctx.textAlign = "left"
      ctx.fillText(`θ = ${(st.theta * 180 / Math.PI).toFixed(1)}°`, 8, size - 16)
      ctx.fillText(`φ = ${(st.phi * 180 / Math.PI).toFixed(1)}°`, 8, size - 6)

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [qubitLabel, qubitColor, size])

  // Mouse / touch drag to rotate
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const drag = dragRef.current

    const onDown = (e: PointerEvent) => {
      drag.dragging = true
      drag.lastX = e.clientX
      drag.lastY = e.clientY
      drag.autoRot = 0
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = "grabbing"
    }
    const onMove = (e: PointerEvent) => {
      if (!drag.dragging) return
      const dx = e.clientX - drag.lastX
      const dy = e.clientY - drag.lastY
      drag.lastX = e.clientX
      drag.lastY = e.clientY
      drag.userRotY += dx * 0.01
      drag.userRotX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, drag.userRotX + dy * 0.01))
    }
    const onUp = (e: PointerEvent) => {
      drag.dragging = false
      try { canvas.releasePointerCapture(e.pointerId) } catch {}
      canvas.style.cursor = "grab"
    }

    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)
    canvas.style.cursor = "grab"
    canvas.style.touchAction = "none"

    return () => {
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
    }
  }, [])

  return <canvas ref={canvasRef} />
}
