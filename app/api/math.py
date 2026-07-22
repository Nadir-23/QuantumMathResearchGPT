from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.auth.dependencies import get_current_active_user
from app.models.user import User
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

router = APIRouter(prefix="/math", tags=["mathematics"])


# ── Equation Operation Requests ──────────────────────────────────────────────

class SimplifyRequest(BaseModel):
    expr: str


class IntegrateRequest(BaseModel):
    expr: str
    variable: str = "x"


class SolveRequest(BaseModel):
    expr: str
    variable: str = "x"


class DifferentiateRequest(BaseModel):
    expr: str
    variable: str = "x"


class ExpandRequest(BaseModel):
    expr: str


class FactorRequest(BaseModel):
    expr: str


class PlotRequest(BaseModel):
    expr: str
    variable: str = "x"
    x_start: float = -10.0
    x_end: float = 10.0
    num_points: int = 200


# ── Matrix Operation Requests ────────────────────────────────────────────────

class MatrixRequest(BaseModel):
    matrix: str = Field(description="Matrix as Python list of lists, e.g. [[1,2],[3,4]]")


class MatrixOperationRequest(BaseModel):
    matrix: str = Field(description="Matrix as Python list of lists, e.g. [[1,2],[3,4]]")
    variable: str = "x"


# ── Equation Endpoints ──────────────────────────────────────────────────────

@router.post("/simplify")
def simplify(req: SimplifyRequest, user: User = Depends(get_current_active_user)):
    return sympy_simplify_expr(req.expr)


@router.post("/integrate")
def integrate(req: IntegrateRequest, user: User = Depends(get_current_active_user)):
    return sympy_integrate_expr(req.expr, req.variable)


@router.post("/solve")
def solve(req: SolveRequest, user: User = Depends(get_current_active_user)):
    return sympy_solve_equation(req.expr, req.variable)


@router.post("/differentiate")
def differentiate(req: DifferentiateRequest, user: User = Depends(get_current_active_user)):
    return sympy_differentiate_expr(req.expr, req.variable, req.order)


@router.post("/expand")
def expand(req: ExpandRequest, user: User = Depends(get_current_active_user)):
    return sympy_expand_expr(req.expr)


@router.post("/factor")
def factor(req: FactorRequest, user: User = Depends(get_current_active_user)):
    return sympy_factor_expr(req.expr)


@router.post("/plot")
def plot(req: PlotRequest, user: User = Depends(get_current_active_user)):
    return sympy_plot_function(
        req.expr,
        req.variable,
        req.x_start,
        req.x_end,
        req.num_points,
    )


# ── Matrix Endpoints ────────────────────────────────────────────────────────

@router.post("/matrix")
def matrix(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "determinant")


@router.post("/matrix/determinant")
def matrix_determinant(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "determinant")


@router.post("/matrix/inverse")
def matrix_inverse(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "inverse")


@router.post("/matrix/eigenvalues")
def matrix_eigenvalues(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "eigenvalues")


@router.post("/matrix/eigenvectors")
def matrix_eigenvectors(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "eigenvectors")


@router.post("/matrix/trace")
def matrix_trace(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "trace")


@router.post("/matrix/rank")
def matrix_rank(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "rank")


@router.post("/matrix/transpose")
def matrix_transpose(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "transpose")


@router.post("/matrix/svd")
def matrix_svd(req: MatrixRequest, user: User = Depends(get_current_active_user)):
    return sympy_matrix_ops(req.matrix, "svd")


# ── ODE Operation Requests ───────────────────────────────────────────────

class ODEAnalyticalRequest(BaseModel):
    equation: str
    func: str = "y"
    independent_var: str = "x"
    ics: Optional[dict] = None


class ODENumericalRequest(BaseModel):
    equation: str
    func: str = "y"
    independent_var: str = "x"
    t_span: List[float] = [0.0, 10.0]
    y0: List[float] = [1.0]
    t_eval: Optional[List[float]] = None
    method: str = "RK45"
    max_step: float = 0.1


# ── ODE Endpoints ────────────────────────────────────────────────────────

@router.post("/ode")
def ode_analytical(req: ODEAnalyticalRequest, user: User = Depends(get_current_active_user)):
    return sympy_ode_solve(
        req.equation,
        req.func,
        req.independent_var,
        req.ics,
    )


@router.post("/ode/numerical")
def ode_numerical(req: ODENumericalRequest, user: User = Depends(get_current_active_user)):
    return scipy_ode_solve(
        req.equation,
        req.func,
        req.independent_var,
        req.t_span,
        req.y0,
        req.t_eval,
        req.method,
        req.max_step,
    )
