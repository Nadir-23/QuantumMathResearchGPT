export type GateName = "H" | "X" | "Y" | "Z" | "T" | "S" | "CNOT" | "SWAP" | "M"

export interface CircuitGate {
  id: string
  name: GateName
  target: number
  control?: number
}

export const QUBIT_STATES = [
  { name: "|0⟩", label: "Zero", theta: 0, phi: 0, color: "#3B82F6" },
  { name: "|1⟩", label: "One", theta: Math.PI, phi: 0, color: "#7C3AED" },
  { name: "|+⟩", label: "Plus", theta: Math.PI / 2, phi: 0, color: "#06B6D4" },
  { name: "|−⟩", label: "Minus", theta: Math.PI / 2, phi: Math.PI, color: "#10B981" },
  { name: "|i⟩", label: "i-State", theta: Math.PI / 2, phi: Math.PI / 2, color: "#F59E0B" },
  { name: "|−i⟩", label: "Neg-i", theta: Math.PI / 2, phi: -Math.PI / 2, color: "#F43F5E" },
]

export const QUBIT_COLORS = ["#3B82F6", "#7C3AED", "#06B6D4", "#10B981", "#F59E0B", "#F43F5E"]

export const GATE_PALETTE: { name: GateName; label: string; color: string; twoQubit?: boolean }[] = [
  { name: "H", label: "Hadamard", color: "from-blue-500 to-blue-600" },
  { name: "X", label: "Pauli-X", color: "from-red-500 to-red-600" },
  { name: "Y", label: "Pauli-Y", color: "from-green-500 to-green-600" },
  { name: "Z", label: "Pauli-Z", color: "from-purple-500 to-purple-600" },
  { name: "T", label: "T Gate", color: "from-amber-500 to-amber-600" },
  { name: "S", label: "S Gate", color: "from-cyan-500 to-cyan-600" },
  { name: "CNOT", label: "CNOT", color: "from-pink-500 to-pink-600", twoQubit: true },
  { name: "SWAP", label: "SWAP", color: "from-indigo-500 to-indigo-600", twoQubit: true },
  { name: "M", label: "Measure", color: "from-gray-500 to-gray-600" },
]

export const PRESETS: { name: string; gates: CircuitGate[]; qubits: number; desc: string }[] = [
  { name: "Bell State", qubits: 2, desc: "|Φ⁺⟩ entangled pair", gates: [
    { id: "p1", name: "H", target: 0 },
    { id: "p2", name: "CNOT", target: 1, control: 0 },
  ]},
  { name: "GHZ State", qubits: 3, desc: "3-qubit GHZ", gates: [
    { id: "p1", name: "H", target: 0 },
    { id: "p2", name: "CNOT", target: 1, control: 0 },
    { id: "p3", name: "CNOT", target: 2, control: 0 },
  ]},
  { name: "Bit Flip", qubits: 2, desc: "Flip q[0] to |1⟩", gates: [
    { id: "p1", name: "X", target: 0 },
  ]},
  { name: "Superposition", qubits: 2, desc: "Hadamard on q[0]", gates: [
    { id: "p1", name: "H", target: 0 },
  ]},
  { name: "All |1⟩", qubits: 2, desc: "Both qubits |1⟩", gates: [
    { id: "p1", name: "X", target: 0 },
    { id: "p2", name: "X", target: 1 },
  ]},
  { name: "QFT-ish", qubits: 3, desc: "H on all qubits", gates: [
    { id: "p1", name: "H", target: 0 },
    { id: "p2", name: "H", target: 1 },
    { id: "p3", name: "H", target: 2 },
  ]},
]

export function applyGate(gate: GateName, theta: number, phi: number): { theta: number; phi: number } {
  switch (gate) {
    case "X": return { theta: Math.PI - theta, phi: phi + Math.PI }
    case "Y": return { theta: Math.PI - theta, phi: -phi + Math.PI }
    case "Z": return { theta, phi: phi + Math.PI }
    case "S": return { theta, phi: phi + Math.PI / 2 }
    case "T": return { theta, phi: phi + Math.PI / 4 }
    case "H": return { theta: Math.PI - theta, phi: Math.PI - phi }
    case "M": return { theta: theta < Math.PI / 2 ? 0 : Math.PI, phi: 0 }
    default: return { theta, phi }
  }
}

export function gateColor(name: GateName): string {
  return GATE_PALETTE.find((g) => g.name === name)?.color ?? "from-blue-500 to-blue-600"
}
