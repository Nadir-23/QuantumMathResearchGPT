from app.tools.sympy_tools import (
    sympy_simplify_expr,
    sympy_integrate_expr,
    sympy_solve_equation,
)
from app.tools.qiskit_tools import qiskit_simulate_statevector
from app.tools.qutip_tools import qutip_time_evolution_two_level

TOOL_REGISTRY = {
    "sympy_simplify_expr": sympy_simplify_expr,
    "sympy_integrate_expr": sympy_integrate_expr,
    "sympy_solve_equation": sympy_solve_equation,
    "qiskit_simulate_statevector": qiskit_simulate_statevector,
    "qutip_time_evolution_two_level": qutip_time_evolution_two_level,
}
