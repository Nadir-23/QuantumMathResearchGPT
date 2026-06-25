"""Tools for mathematical and quantum computations"""

import sympy as sp
from sympy import symbols, simplify, integrate, diff, solve, Matrix, Eq, latex, sympify
import numpy as np
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator
import json
from typing import Any, Dict, List
import logging

logger = logging.getLogger(__name__)


# ============ Mathematical Tools ============

def sympy_simplify(expression: str) -> Dict[str, Any]:
    """
    Simplify a mathematical expression using SymPy.
    
    Args:
        expression: Mathematical expression as string
        
    Returns:
        Dictionary with simplified expression and LaTeX representation
    """
    try:
        expr = sympify(expression)
        simplified = simplify(expr)
        return {
            "original": str(expr),
            "simplified": str(simplified),
            "latex": latex(simplified),
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


def sympy_differentiate(expression: str, variable: str = "x") -> Dict[str, Any]:
    """
    Differentiate an expression with respect to a variable.
    
    Args:
        expression: Mathematical expression
        variable: Variable to differentiate with respect to
        
    Returns:
        Dictionary with derivative and LaTeX representation
    """
    try:
        x = symbols(variable)
        expr = sympify(expression)
        derivative = diff(expr, x)
        return {
            "expression": str(expr),
            "variable": variable,
            "derivative": str(derivative),
            "latex": latex(derivative),
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


def sympy_integrate(expression: str, variable: str = "x", limits: tuple = None) -> Dict[str, Any]:
    """
    Integrate an expression.
    
    Args:
        expression: Mathematical expression
        variable: Integration variable
        limits: Optional tuple of (lower, upper) limits for definite integral
        
    Returns:
        Dictionary with integral and LaTeX representation
    """
    try:
        x = symbols(variable)
        expr = sympify(expression)
        
        if limits:
            result = integrate(expr, (x, limits[0], limits[1]))
            integral_type = "definite"
        else:
            result = integrate(expr, x)
            integral_type = "indefinite"
            
        return {
            "expression": str(expr),
            "variable": variable,
            "type": integral_type,
            "result": str(result),
            "latex": latex(result),
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


def sympy_solve(equation: str, variable: str = "x") -> Dict[str, Any]:
    """
    Solve an equation for a variable.
    
    Args:
        equation: Equation as string (e.g., "x**2 - 4 = 0")
        variable: Variable to solve for
        
    Returns:
        Dictionary with solutions
    """
    try:
        x = symbols(variable)
        # Handle both equation format (lhs = rhs) and expression format
        if "=" in equation:
            lhs, rhs = equation.split("=")
            eq = Eq(sympify(lhs), sympify(rhs))
        else:
            eq = Eq(sympify(equation), 0)
            
        solutions = solve(eq, x)
        return {
            "equation": str(eq),
            "variable": variable,
            "solutions": [str(sol) for sol in solutions],
            "solutions_latex": [latex(sol) for sol in solutions],
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


def sympy_matrix_operations(operation: str, matrix_data: str) -> Dict[str, Any]:
    """
    Perform matrix operations (determinant, eigenvalues, rank, etc.).
    
    Args:
        operation: Operation name (determinant, eigenvalues, rank, inverse, etc.)
        matrix_data: Matrix as string or JSON
        
    Returns:
        Dictionary with operation result
    """
    try:
        # Parse matrix from string or JSON
        if isinstance(matrix_data, str):
            if matrix_data.startswith("["):
                matrix_list = json.loads(matrix_data)
            else:
                matrix_list = sympify(matrix_data)
                
        M = Matrix(matrix_list)
        
        operations_map = {
            "determinant": lambda m: m.det(),
            "eigenvalues": lambda m: m.eigenvals(),
            "eigenvects": lambda m: m.eigenvects(),
            "rank": lambda m: m.rank(),
            "inverse": lambda m: m.inv() if m.det() != 0 else "Matrix is singular",
            "transpose": lambda m: m.T,
            "trace": lambda m: M.trace()
        }
        
        if operation not in operations_map:
            return {"error": f"Unknown operation: {operation}", "status": "failed"}
            
        result = operations_map[operation](M)
        
        return {
            "matrix": str(M),
            "operation": operation,
            "result": str(result),
            "latex": latex(result) if hasattr(result, '__call__') is False else "N/A",
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


# ============ Quantum Circuit Tools ============

def qiskit_create_bell_state(qubits: int = 2) -> Dict[str, Any]:
    """
    Create and visualize a Bell state circuit.
    
    Args:
        qubits: Number of qubits (typically 2 for Bell states)
        
    Returns:
        Dictionary with circuit information
    """
    try:
        qc = QuantumCircuit(qubits, qubits, name="Bell State")
        
        # Create Bell state: |Φ+⟩ = (|00⟩ + |11⟩)/√2
        qc.h(0)
        qc.cx(0, 1)
        qc.measure(range(qubits), range(qubits))
        
        return {
            "circuit_name": "Bell State",
            "num_qubits": qubits,
            "circuit_str": str(qc),
            "circuit_depth": qc.depth(),
            "circuit_size": qc.size(),
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


def qiskit_simulate_circuit(circuit_instructions: str, shots: int = 1000) -> Dict[str, Any]:
    """
    Simulate a quantum circuit and get measurement results.
    
    Args:
        circuit_instructions: Description of circuit
        shots: Number of simulation shots
        
    Returns:
        Dictionary with measurement results
    """
    try:
        # Create a simple Bell state for demonstration
        qc = QuantumCircuit(2, 2, name="Test Circuit")
        qc.h(0)
        qc.cx(0, 1)
        qc.measure([0, 1], [0, 1])
        
        simulator = AerSimulator()
        result = simulator.run(qc, shots=shots).result()
        counts = result.get_counts()
        
        return {
            "circuit": str(qc),
            "shots": shots,
            "measurement_results": dict(counts),
            "most_likely": max(counts, key=counts.get),
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


def qiskit_hadamard_transform(qubits: int = 3) -> Dict[str, Any]:
    """
    Create and describe a quantum Hadamard transform circuit.
    
    Args:
        qubits: Number of qubits
        
    Returns:
        Dictionary with circuit information
    """
    try:
        qc = QuantumCircuit(qubits, qubits, name="Hadamard Transform")
        
        for i in range(qubits):
            qc.h(i)
            
        qc.measure(range(qubits), range(qubits))
        
        return {
            "circuit_name": "Hadamard Transform",
            "num_qubits": qubits,
            "circuit_str": str(qc),
            "description": f"Applies Hadamard gates to {qubits} qubits, creating uniform superposition",
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


# ============ Quantum Physics Tools ============

def quantum_schrodinger_equation() -> Dict[str, Any]:
    """
    Provide Schrödinger equation information and solutions.
    
    Returns:
        Dictionary with equation details
    """
    try:
        # Time-dependent Schrödinger equation
        t, x = symbols('t x', real=True)
        psi = sp.Function('psi')
        
        return {
            "equation_name": "Time-Dependent Schrödinger Equation",
            "equation": "iℏ ∂ψ/∂t = -ℏ²/(2m) ∂²ψ/∂x² + V(x)ψ",
            "components": {
                "i": "imaginary unit",
                "ℏ": "reduced Planck constant",
                "ψ": "wave function",
                "m": "particle mass",
                "V(x)": "potential energy",
                "t": "time",
                "x": "position"
            },
            "interpretation": "Describes how quantum systems evolve over time",
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


def particle_in_a_box() -> Dict[str, Any]:
    """
    Analyze particle in a box quantum system.
    
    Returns:
        Dictionary with solution information
    """
    try:
        x, L, n = symbols('x L n', positive=True, real=True)
        
        # Energy levels
        E_n = (n**2 * sp.pi**2) / (2 * L**2)
        
        # Wave function
        psi_n = sp.sqrt(2/L) * sp.sin(n * sp.pi * x / L)
        
        return {
            "system": "Particle in a Box",
            "energy_levels": str(E_n),
            "energy_latex": latex(E_n),
            "wave_function": str(psi_n),
            "wave_function_latex": latex(psi_n),
            "properties": {
                "ground_state": f"E_1 = π²/(2L²)",
                "nodes": f"n-1 nodes at walls",
                "orthogonal": True
            },
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


# ============ Research Tools ============

def arxiv_research_summary(query: str, max_results: int = 3) -> Dict[str, Any]:
    """
    Search arXiv for research papers and provide summaries.
    
    Args:
        query: Search query
        max_results: Maximum number of results
        
    Returns:
        Dictionary with paper information
    """
    try:
        import arxiv
        
        client = arxiv.Client()
        search = arxiv.Search(query=query, max_results=max_results, sort_by=arxiv.SortCriterion.SubmittedDate)
        
        papers = []
        for paper in client.results(search):
            papers.append({
                "title": paper.title,
                "authors": [author.name for author in paper.authors[:3]],
                "published": str(paper.published)[:10],
                "summary": paper.summary[:500] + "..." if len(paper.summary) > 500 else paper.summary,
                "arxiv_id": paper.arxiv_id,
                "url": paper.pdf_url
            })
            
        return {
            "query": query,
            "results": len(papers),
            "papers": papers,
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}


# Tool registry for Anthropic tool calling
TOOLS = [
    {
        "name": "sympy_simplify",
        "description": "Simplify mathematical expressions using SymPy",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Mathematical expression to simplify"
                }
            },
            "required": ["expression"]
        }
    },
    {
        "name": "sympy_differentiate",
        "description": "Differentiate mathematical expressions",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Expression to differentiate"},
                "variable": {"type": "string", "description": "Variable to differentiate with respect to", "default": "x"}
            },
            "required": ["expression"]
        }
    },
    {
        "name": "sympy_integrate",
        "description": "Integrate mathematical expressions",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Expression to integrate"},
                "variable": {"type": "string", "description": "Integration variable", "default": "x"},
                "limits": {"type": "array", "description": "Integration limits [lower, upper]"}
            },
            "required": ["expression"]
        }
    },
    {
        "name": "sympy_solve",
        "description": "Solve equations for a variable",
        "input_schema": {
            "type": "object",
            "properties": {
                "equation": {"type": "string", "description": "Equation to solve"},
                "variable": {"type": "string", "description": "Variable to solve for", "default": "x"}
            },
            "required": ["equation"]
        }
    },
    {
        "name": "qiskit_create_bell_state",
        "description": "Create a Bell state quantum circuit",
        "input_schema": {
            "type": "object",
            "properties": {
                "qubits": {"type": "integer", "description": "Number of qubits", "default": 2}
            }
        }
    },
    {
        "name": "qiskit_simulate_circuit",
        "description": "Simulate a quantum circuit",
        "input_schema": {
            "type": "object",
            "properties": {
                "circuit_instructions": {"type": "string", "description": "Circuit description"},
                "shots": {"type": "integer", "description": "Number of simulation shots", "default": 1000}
            }
        }
    },
    {
        "name": "quantum_schrodinger_equation",
        "description": "Get information about the Schrödinger equation",
        "input_schema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "particle_in_a_box",
        "description": "Analyze the particle in a box quantum system",
        "input_schema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "arxiv_research_summary",
        "description": "Search arXiv for research papers",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"},
                "max_results": {"type": "integer", "description": "Maximum results", "default": 3}
            },
            "required": ["query"]
        }
    }
]


def execute_tool(tool_name: str, tool_input: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a tool by name with given input"""
    
    tools_map = {
        "sympy_simplify": lambda **kw: sympy_simplify(**kw),
        "sympy_differentiate": lambda **kw: sympy_differentiate(**{k: v for k, v in kw.items() if k in ['expression', 'variable']}),
        "sympy_integrate": lambda **kw: sympy_integrate(**{k: v for k, v in kw.items() if k in ['expression', 'variable', 'limits']}),
        "sympy_solve": lambda **kw: sympy_solve(**{k: v for k, v in kw.items() if k in ['equation', 'variable']}),
        "qiskit_create_bell_state": lambda **kw: qiskit_create_bell_state(**{k: v for k, v in kw.items() if k in ['qubits']}),
        "qiskit_simulate_circuit": lambda **kw: qiskit_simulate_circuit(**{k: v for k, v in kw.items() if k in ['circuit_instructions', 'shots']}),
        "quantum_schrodinger_equation": lambda **kw: quantum_schrodinger_equation(),
        "particle_in_a_box": lambda **kw: particle_in_a_box(),
        "arxiv_research_summary": lambda **kw: arxiv_research_summary(**{k: v for k, v in kw.items() if k in ['query', 'max_results']})
    }
    
    if tool_name not in tools_map:
        return {"error": f"Unknown tool: {tool_name}"}
        
    try:
        return tools_map[tool_name](**tool_input)
    except Exception as e:
        return {"error": str(e), "tool": tool_name}
