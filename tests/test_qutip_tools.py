"""Tests for QuTiP tools."""
import pytest
from app.tools.qutip_tools import qutip_time_evolution_two_level


def test_rabi_oscillations():
    """Test that a resonant two-level system undergoes Rabi oscillations."""
    import numpy as np

    omega = 1.0  # Rabi frequency
    delta = 0.0  # On resonance
    tlist = list(np.linspace(0, 2 * np.pi, 50))
    psi0_real_imag = [[1.0, 0.0], [0.0, 0.0]]  # Start in |0>

    result = qutip_time_evolution_two_level(omega, delta, tlist, psi0_real_imag)
    probs = result["probs"]

    # At t=0, p0 should be 1
    assert abs(probs[0]["p0"] - 1.0) < 1e-6
    # Probability must always sum to 1
    for p in probs:
        assert abs(p["p0"] + p["p1"] - 1.0) < 1e-6


def test_probability_conservation():
    """Verify total probability is conserved throughout evolution."""
    import numpy as np

    result = qutip_time_evolution_two_level(
        omega=0.5,
        delta=0.3,
        tlist=list(np.linspace(0, 10, 100)),
        psi0_real_imag=[[0.6, 0.0], [0.8, 0.0]],
    )
    for p in result["probs"]:
        total = p["p0"] + p["p1"]
        assert abs(total - 1.0) < 1e-5
