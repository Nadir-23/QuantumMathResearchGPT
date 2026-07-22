"""Tests for ODE tools."""
import pytest
from app.tools.ode_tools import sympy_ode_solve, scipy_ode_solve


def test_ode_simple_exponential():
    """y' + y = 0 => y = C*exp(-x)"""
    result = sympy_ode_solve("Diff(y(x), x) + y(x)", "y", "x")
    sol = result["general_solution"]
    assert "exp(-x)" in sol or "exp(-1*x)" in sol


def test_ode_second_order():
    """y'' + y = 0 => y = C1*sin(x) + C2*cos(x)"""
    result = sympy_ode_solve(
        "Diff(y(x), x, 2) + y(x)", "y", "x"
    )
    sol = result["general_solution"]
    assert "sin" in sol or "cos" in sol


def test_ode_with_initial_conditions():
    """y' + y = 0, y(0) = 1 => y = exp(-x)"""
    result = sympy_ode_solve(
        "Diff(y(x), x) + y(x)",
        "y",
        "x",
        ics={"y(0)": 1},
    )
    assert "particular_solution" in result
    sol = result["particular_solution"]
    assert "exp" in sol


def test_ode_type_classification():
    """ODE should be classified."""
    result = sympy_ode_solve("Diff(y(x), x) + y(x)", "y", "x")
    assert len(result["ode_type"]) > 0


def test_scipy_ode_exponential_decay():
    """dy/dx = -y, y(0)=1 => y(x) = exp(-x)"""
    result = scipy_ode_solve(
        equation="-y",
        func="y",
        independent_var="x",
        t_span=[0.0, 2.0],
        y0=[1.0],
        t_eval=[0.0, 1.0, 2.0],
    )
    assert result["success"]
    y_vals = result["y"][0]
    assert abs(y_vals[0] - 1.0) < 1e-6
    assert abs(y_vals[1] - 2.71828 ** (-1.0)) < 0.01
    assert abs(y_vals[2] - 2.71828 ** (-2.0)) < 0.01


def test_scipy_ode_custom_method():
    """Test with a different integration method."""
    result = scipy_ode_solve(
        equation="-y",
        func="y",
        independent_var="x",
        t_span=[0.0, 1.0],
        y0=[1.0],
        method="BDF",
    )
    assert result["success"]
    assert result["method"] == "BDF"
