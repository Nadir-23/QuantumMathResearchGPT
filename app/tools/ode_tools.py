from __future__ import annotations

from typing import Any, Dict, List, Optional

import sympy as sp
from sympy import Function, dsolve, Eq, classify_ode, sympify

SYMPY_LOCALS = {"pi": sp.pi, "E": sp.E, "I": sp.I}


def sympy_ode_solve(
    equation: str,
    func: str = "y",
    independent_var: str = "x",
    ics: Optional[Dict[str, float]] = None,
) -> Dict[str, Any]:
    """
    Solve an ordinary differential equation analytically using SymPy's dsolve.

    The equation should be written as a SymPy expression equal to zero,
    e.g. "Diff(y(x), x) + y(x)" for y' + y = 0.

    Args:
        equation: ODE as a SymPy expression (equal to zero).
        func: Name of the dependent variable function (default "y").
        independent_var: Name of the independent variable (default "x").
        ics: Optional initial conditions as {func(0): value, func'(0): value, ...}.

    Returns:
        Dict with the general solution, particular solution (if ics given),
        classified ODE type, and LaTeX representations.
    """
    x = sp.Symbol(independent_var)
    y = Function(func)

    eq_str = equation.replace("Diff(", "Derivative(")
    expr = sympify(eq_str, locals=SYMPY_LOCALS)
    ode = Eq(expr, 0)

    ode_class = classify_ode(ode, y(x))

    general_sol = dsolve(ode, y(x))

    result: Dict[str, Any] = {
        "equation": str(ode),
        "equation_latex": sp.latex(ode),
        "function": func,
        "independent_var": independent_var,
        "general_solution": str(general_sol),
        "general_solution_latex": sp.latex(general_sol),
        "ode_type": list(ode_class) if ode_class else [],
    }

    if ics:
        ics_sympy = {}
        for key, val in ics.items():
            k = sympify(key, locals=SYMPY_LOCALS)
            ics_sympy[k] = val
        particular_sol = dsolve(ode, y(x), ics=ics_sympy)
        result["particular_solution"] = str(particular_sol)
        result["particular_solution_latex"] = sp.latex(particular_sol)

    return result


def scipy_ode_solve(
    equation: str,
    func: str = "y",
    independent_var: str = "x",
    t_span: List[float] = [0.0, 10.0],
    y0: List[float] = [1.0],
    t_eval: Optional[List[float]] = None,
    method: str = "RK45",
    max_step: float = 0.1,
) -> Dict[str, Any]:
    """
    Solve an ODE numerically using scipy's solve_ivp.

    The equation should be written as a SymPy expression for dy/dx (or the
    right-hand side of the first-order ODE). For a system of ODEs, provide
    a list of expressions.

    Args:
        equation: Right-hand side of dy/dx = f(x, y), as a SymPy expression
                  or a list of expressions for systems.
        func: Name of the dependent variable(s).
        independent_var: Name of the independent variable.
        t_span: Integration interval [t_start, t_end].
        y0: Initial condition(s).
        t_eval: Optional time points at which to store the solution.
        method: Integration method (RK45, RK23, DOP853, Radau, BDF, LSODA).
        max_step: Maximum step size.

    Returns:
        Dict with time points, solution values, and status information.
    """
    import numpy as np
    from scipy.integrate import solve_ivp

    x = sp.Symbol(independent_var)

    if isinstance(equation, list):
        exprs = [sympify(e, locals=SYMPY_LOCALS) for e in equation]
        funcs_list = [Function(f) for f in func] if isinstance(func, list) else [Function(func)]
        n = len(exprs)
        all_syms = [f(x) for f in funcs_list]
        lambdas = [sp.lambdify(all_syms, e, modules=["math", "sympy"]) for e in exprs]

        def rhs(t, y_vec):
            return [l(*y_vec[:n]) for l in lambdas]
    else:
        expr = sympify(equation, locals=SYMPY_LOCALS)
        y_sym = Function(func)
        y_dep = y_sym(x)

        # Use the function symbol that actually appears in the expression
        if y_dep in expr.free_symbols or any(y_dep == a for a in expr.args):
            lam = sp.lambdify([y_dep], expr, modules=["math", "sympy"])
        else:
            # Expression uses bare symbol y, not y(x)
            y_bare = sp.Symbol(func)
            lam = sp.lambdify([y_bare], expr, modules=["math", "sympy"])

        def rhs(t, y_vec):
            return [float(lam(y_vec[0]))]

    t_eval_arr = np.array(t_eval) if t_eval else None

    sol = solve_ivp(
        rhs,
        t_span,
        y0,
        method=method,
        t_eval=t_eval_arr,
        max_step=max_step,
        dense_output=True,
    )

    t_out = sol.t.tolist()
    y_out = sol.y.tolist() if sol.y.ndim > 1 else [sol.y.tolist()]

    return {
        "t": t_out,
        "y": y_out,
        "method": method,
        "success": sol.success,
        "message": sol.message,
        "n_points": len(t_out),
    }
