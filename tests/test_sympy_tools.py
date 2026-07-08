"""Tests for SymPy tools."""
import pytest
from app.tools.sympy_tools import (
    sympy_simplify_expr,
    sympy_integrate_expr,
    sympy_solve_equation,
)


def test_simplify_expr():
    result = sympy_simplify_expr("sin(x)**2 + cos(x)**2")
    assert result["simplified"] == "1"


def test_integrate_expr():
    result = sympy_integrate_expr("x**2", "x")
    assert "x**3" in result["integral"]


def test_solve_equation():
    result = sympy_solve_equation("x**2 - 4", "0", "x")
    solutions = result["solutions"]
    assert "-2" in solutions
    assert "2" in solutions


def test_cubic_equation():
    result = sympy_solve_equation("x**3 - 6*x**2 + 11*x - 6", "0", "x")
    solutions = set(result["solutions"])
    assert {"1", "2", "3"} == solutions
