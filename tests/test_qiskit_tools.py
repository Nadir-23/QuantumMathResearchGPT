"""Tests for Qiskit tools."""
import pytest
from app.tools.qiskit_tools import qiskit_simulate_statevector


def test_bell_state():
    """Simulate a Bell state |Phi+> = (|00> + |11>) / sqrt(2)."""
    result = qiskit_simulate_statevector(
        num_qubits=2,
        gates=[
            {"type": "h", "qubits": [0]},
            {"type": "cx", "qubits": [0, 1]},
        ],
    )
    sv = result["statevector"]
    # Bell state has equal probability for |00> and |11>
    prob_00 = sv[0]["probability"]
    prob_11 = sv[3]["probability"]
    assert abs(prob_00 - 0.5) < 1e-6
    assert abs(prob_11 - 0.5) < 1e-6


def test_single_qubit_hadamard():
    """H|0> = (|0> + |1>) / sqrt(2)."""
    result = qiskit_simulate_statevector(
        num_qubits=1,
        gates=[{"type": "h", "qubits": [0]}],
    )
    sv = result["statevector"]
    assert abs(sv[0]["probability"] - 0.5) < 1e-6
    assert abs(sv[1]["probability"] - 0.5) < 1e-6
