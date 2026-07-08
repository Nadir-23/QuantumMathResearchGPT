from __future__ import annotations

from typing import Any, Dict

import sympy as sp


def sympy_simplify_expr(expr: str) -> Dict[str, Any]:
    """Simplify a symbolic expression using SymPy."""
    e = sp.sympify(expr, locals={"pi": sp.pi, "E": sp.E, "I": sp.I})
    simplified = sp.simplify(e)
    return {
        "original": expr,
        "simplified": str(simplified),
        "latex": sp.latex(simplified),
    }


def sympy_integrate_expr(expr: str, variable: str) -> Dict[str, Any]:
    """Compute an indefinite integral exactly using SymPy."""
    v = sp.Symbol(variable)
    e = sp.sympify(expr, locals={"pi": sp.pi, "E": sp.E, "I": sp.I})
    result = sp.integrate(e, v)
    return {
        "expr": expr,
        "variable": variable,
        "integral": str(result),
        "latex": sp.latex(result),
    }


def sympy_solve_equation(left: str, right: str, variable: str) -> Dict[str, Any]:
    """Solve an equation exactly using SymPy."""
    v = sp.Symbol(variable)
    l = sp.sympify(left, locals={"pi": sp.pi, "E": sp.E, "I": sp.I})
    r = sp.sympify(right, locals={"pi": sp.pi, "E": sp.E, "I": sp.I})
    solutions = sp.solve(sp.Eq(l, r), v)
    return {
        "equation": f"{left} = {right}",
        "variable": variable,
        "solutions": [str(s) for s in solutions],
        "solutions_latex": [sp.latex(s) for s in solutions],
    }
