from app.tools.sympy_tools import (
    sympy_simplify_expr,
    sympy_integrate_expr,
    sympy_solve_equation,
    sympy_differentiate_expr,
    sympy_expand_expr,
    sympy_factor_expr,
    sympy_plot_function,
    sympy_matrix_ops,
)
from app.tools.ode_tools import sympy_ode_solve, scipy_ode_solve
from app.tools.qiskit_tools import qiskit_simulate_statevector
from app.tools.qutip_tools import qutip_time_evolution_two_level

TOOL_REGISTRY = {
    "sympy_simplify_expr": sympy_simplify_expr,
    "sympy_integrate_expr": sympy_integrate_expr,
    "sympy_solve_equation": sympy_solve_equation,
    "sympy_differentiate_expr": sympy_differentiate_expr,
    "sympy_expand_expr": sympy_expand_expr,
    "sympy_factor_expr": sympy_factor_expr,
    "sympy_plot_function": sympy_plot_function,
    "sympy_matrix_ops": sympy_matrix_ops,
    "sympy_ode_solve": sympy_ode_solve,
    "scipy_ode_solve": scipy_ode_solve,
    "qiskit_simulate_statevector": qiskit_simulate_statevector,
    "qutip_time_evolution_two_level": qutip_time_evolution_two_level,
}
