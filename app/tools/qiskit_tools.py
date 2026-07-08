from __future__ import annotations

from typing import Any, Dict, List

from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector


def qiskit_simulate_statevector(
    num_qubits: int,
    gates: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Simulate a quantum circuit using Qiskit and return statevector amplitudes."""
    qc = QuantumCircuit(num_qubits)

    for g in gates:
        t = g["type"].lower()
        qs = [int(x) for x in g["qubits"]]

        if t == "h":
            qc.h(qs[0])
        elif t == "x":
            qc.x(qs[0])
        elif t == "z":
            qc.z(qs[0])
        elif t == "y":
            qc.y(qs[0])
        elif t == "cx":
            qc.cx(qs[0], qs[1])
        elif t == "cz":
            qc.cz(qs[0], qs[1])
        elif t == "swap":
            qc.swap(qs[0], qs[1])
        elif t == "rx":
            qc.rx(float(g["theta"]), qs[0])
        elif t == "ry":
            qc.ry(float(g["theta"]), qs[0])
        elif t == "rz":
            qc.rz(float(g["theta"]), qs[0])
        else:
            raise ValueError(f"Unsupported gate type: {g['type']}")

    sv = Statevector.from_instruction(qc)
    amps = [complex(a) for a in sv.data]

    return {
        "num_qubits": num_qubits,
        "statevector": [
            {
                "basis_index": i,
                "amplitude": [a.real, a.imag],
                "probability": abs(a) ** 2,
            }
            for i, a in enumerate(amps)
        ],
        "basis_order_note": "Qiskit computational basis ordering applies.",
    }
