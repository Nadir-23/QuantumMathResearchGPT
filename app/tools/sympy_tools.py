from __future__ import annotations

import math
from typing import Any, Dict, List

import sympy as sp

SYMPY_LOCALS = {"pi": sp.pi, "E": sp.E, "I": sp.I}


def sympy_simplify_expr(expr: str) -> Dict[str, Any]:
    """Simplify a symbolic expression using SymPy."""
    e = sp.sympify(expr, locals=SYMPY_LOCALS)
    simplified = sp.simplify(e)
    return {
        "original": expr,
        "simplified": str(simplified),
        "latex": sp.latex(simplified),
    }


def sympy_integrate_expr(expr: str, variable: str) -> Dict[str, Any]:
    """Compute an indefinite integral exactly using SymPy."""
    v = sp.Symbol(variable)
    e = sp.sympify(expr, locals=SYMPY_LOCALS)
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
    l = sp.sympify(left, locals=SYMPY_LOCALS)
    r = sp.sympify(right, locals=SYMPY_LOCALS)
    solutions = sp.solve(sp.Eq(l, r), v)
    return {
        "equation": f"{left} = {right}",
        "variable": variable,
        "solutions": [str(s) for s in solutions],
        "solutions_latex": [sp.latex(s) for s in solutions],
    }


def sympy_differentiate_expr(expr: str, variable: str) -> Dict[str, Any]:
    """Compute the derivative of an expression using SymPy."""
    v = sp.Symbol(variable)
    e = sp.sympify(expr, locals=SYMPY_LOCALS)
    result = sp.diff(e, v)
    return {
        "expr": expr,
        "variable": variable,
        "derivative": str(result),
        "latex": sp.latex(result),
    }


def sympy_expand_expr(expr: str) -> Dict[str, Any]:
    """Expand a symbolic expression."""
    e = sp.sympify(expr, locals=SYMPY_LOCALS)
    expanded = sp.expand(e)
    return {
        "original": expr,
        "expanded": str(expanded),
        "latex": sp.latex(expanded),
    }


def sympy_factor_expr(expr: str) -> Dict[str, Any]:
    """Factor a symbolic expression."""
    e = sp.sympify(expr, locals=SYMPY_LOCALS)
    factored = sp.factor(e)
    return {
        "original": expr,
        "factored": str(factored),
        "latex": sp.latex(factored),
    }


def sympy_plot_function(
    expr: str,
    variable: str,
    x_start: float = -10.0,
    x_end: float = 10.0,
    num_points: int = 200,
) -> Dict[str, Any]:
    """Evaluate a function over a range and return points for plotting."""
    v = sp.Symbol(variable)
    e = sp.sympify(expr, locals=SYMPY_LOCALS)
    f = sp.lambdify(v, e, modules=["math", "sympy"])

    step = (x_end - x_start) / (num_points - 1)
    x_vals: List[float] = []
    y_vals: List[float] = []

    for i in range(num_points):
        x = x_start + i * step
        try:
            y = f(x)
            if isinstance(y, complex):
                y = y.real
            if math.isfinite(y):
                x_vals.append(round(x, 6))
                y_vals.append(round(y, 6))
        except (ValueError, ZeroDivisionError, OverflowError):
            continue

    return {
        "expr": expr,
        "variable": variable,
        "x": x_vals,
        "y": y_vals,
        "latex": sp.latex(e),
    }


def sympy_matrix_ops(matrix_str: str, operation: str = "determinant") -> Dict[str, Any]:
    """Perform matrix operations: determinant, inverse, eigenvalues, eigenvectors, trace, rank, SVD, transpose."""
    import ast

    rows = ast.literal_eval(matrix_str)
    mat = sp.Matrix(rows)

    result: Dict[str, Any] = {
        "matrix": str(mat),
        "latex": sp.latex(mat),
        "operation": operation,
    }

    if operation == "determinant":
        det = mat.det()
        result["result"] = str(det)
        result["result_latex"] = sp.latex(det)
    elif operation == "inverse":
        inv = mat.inv()
        result["result"] = str(inv)
        result["result_latex"] = sp.latex(inv)
    elif operation == "eigenvalues":
        eigenvals = mat.eigenvals()
        vals = []
        for val, mult in eigenvals.items():
            vals.append({"value": str(val), "multiplicity": mult, "latex": sp.latex(val)})
        result["eigenvalues"] = vals
        result["result"] = str([(str(v), m) for v, m in eigenvals.items()])
    elif operation == "eigenvectors":
        eigenvecs = mat.eigenvects()
        vecs = []
        for val, mult, basis in eigenvecs:
            vecs.append({
                "value": str(val),
                "multiplicity": mult,
                "vectors": [str(v) for v in basis],
                "vectors_latex": [sp.latex(v) for v in basis],
            })
        result["eigenvectors"] = vecs
        result["result"] = str([(str(v), m, [str(b) for b in basis]) for v, m, basis in eigenvecs])
    elif operation == "trace":
        tr = mat.trace()
        result["result"] = str(tr)
        result["result_latex"] = sp.latex(tr)
    elif operation == "rank":
        result["result"] = str(mat.rank())
    elif operation == "transpose":
        t = mat.T
        result["result"] = str(t)
        result["result_latex"] = sp.latex(t)
    elif operation == "svd":
        import numpy as np
        mat_np = np.array(mat.tolist(), dtype=float)
        U_np, S_np, Vt_np = np.linalg.svd(mat_np)
        U = sp.Matrix(U_np.tolist())
        S_diag = sp.Matrix(np.diag(S_np).tolist())
        V = sp.Matrix(Vt_np.tolist())
        result["U"] = str(U)
        result["U_latex"] = sp.latex(U)
        result["S"] = str(S_diag)
        result["S_latex"] = sp.latex(S_diag)
        result["V"] = str(V)
        result["V_latex"] = sp.latex(V)
        result["result"] = f"U={U}, S={S_diag}, V={V}"
    else:
        result["error"] = f"Unknown operation: {operation}"

    return result
