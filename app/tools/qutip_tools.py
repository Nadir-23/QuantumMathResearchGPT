from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import qutip as qt


def qutip_time_evolution_two_level(
    omega: float,
    delta: float,
    tlist: List[float],
    psi0_real_imag: List[List[float]],
) -> Dict[str, Any]:
    """
    Time evolve a two-level system with Hamiltonian:
        H = (delta/2) * sigma_z + (omega/2) * sigma_x

    Args:
        omega: Rabi frequency (coupling term coefficient)
        delta: Detuning (diagonal term coefficient)
        tlist: List of time points to evaluate
        psi0_real_imag: Initial state as [[alpha_re, alpha_im], [beta_re, beta_im]]

    Returns:
        Dict with tlist and probabilities at each time step
    """
    sx = qt.sigmax()
    sz = qt.sigmaz()
    H = (delta / 2.0) * sz + (omega / 2.0) * sx

    alpha = complex(psi0_real_imag[0][0], psi0_real_imag[0][1])
    beta = complex(psi0_real_imag[1][0], psi0_real_imag[1][1])
    vec = np.array([alpha, beta], dtype=complex).reshape(2)

    ket0 = qt.Qobj(vec).unit()
    result = qt.sesolve(H, ket0, tlist)

    probs = []
    for st in result.states:
        a0 = st.full()[0, 0]
        a1 = st.full()[1, 0]
        probs.append({"p0": float(abs(a0) ** 2), "p1": float(abs(a1) ** 2)})

    return {"tlist": tlist, "probs": probs}
