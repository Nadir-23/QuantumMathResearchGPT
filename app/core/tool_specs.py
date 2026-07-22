TOOL_SPECS = [
    {
        "name": "sympy_simplify_expr",
        "description": "Simplify a symbolic expression using SymPy. Input 'expr' is a Python/SymPy-like string.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expr": {"type": "string"},
            },
            "required": ["expr"],
        },
    },
    {
        "name": "sympy_integrate_expr",
        "description": "Compute an indefinite integral exactly using SymPy. Input as 'expr' and 'variable'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expr": {"type": "string"},
                "variable": {"type": "string"},
            },
            "required": ["expr", "variable"],
        },
    },
    {
        "name": "sympy_solve_equation",
        "description": "Solve an equation exactly using SymPy. Provide 'left', 'right', and 'variable'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "left": {"type": "string"},
                "right": {"type": "string"},
                "variable": {"type": "string"},
            },
            "required": ["left", "right", "variable"],
        },
    },
    {
        "name": "sympy_differentiate_expr",
        "description": "Compute the derivative of an expression with respect to a variable.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expr": {"type": "string"},
                "variable": {"type": "string"},
            },
            "required": ["expr", "variable"],
        },
    },
    {
        "name": "sympy_expand_expr",
        "description": "Expand a symbolic expression into a sum of terms.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expr": {"type": "string"},
            },
            "required": ["expr"],
        },
    },
    {
        "name": "sympy_factor_expr",
        "description": "Factor a symbolic expression into a product of irreducible factors.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expr": {"type": "string"},
            },
            "required": ["expr"],
        },
    },
    {
        "name": "sympy_plot_function",
        "description": "Evaluate a function over a range and return x,y data points for plotting.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expr": {"type": "string"},
                "variable": {"type": "string"},
                "x_start": {"type": "number", "default": -10.0},
                "x_end": {"type": "number", "default": 10.0},
                "num_points": {"type": "integer", "default": 200},
            },
            "required": ["expr", "variable"],
        },
    },
    {
        "name": "sympy_matrix_ops",
        "description": "Perform matrix operations (determinant, inverse, eigenvalues, transpose, rank) on a matrix.",
        "input_schema": {
            "type": "object",
            "properties": {
                "matrix_str": {"type": "string", "description": "Matrix as Python list of lists, e.g. [[1,2],[3,4]]"},
                "operation": {"type": "string", "enum": ["determinant", "inverse", "eigenvalues", "eigenvectors", "trace", "rank", "transpose", "svd"]},
            },
            "required": ["matrix_str", "operation"],
        },
    },
    {
        "name": "qiskit_simulate_statevector",
        "description": "Simulate a quantum circuit using Qiskit and return statevector amplitudes.",
        "input_schema": {
            "type": "object",
            "properties": {
                "num_qubits": {"type": "integer", "minimum": 1},
                "gates": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "type": {"type": "string"},
                            "qubits": {"type": "array", "items": {"type": "integer"}},
                            "theta": {"type": "number"},
                        },
                        "required": ["type", "qubits"],
                    },
                },
            },
            "required": ["num_qubits", "gates"],
        },
    },
    {
        "name": "qutip_time_evolution_two_level",
        "description": (
            "Time evolve a two-level system with Hamiltonian H=(delta/2)*sigma_z+(omega/2)*sigma_x. "
            "psi0 is provided as real/imag parts to represent complex amplitudes."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "omega": {"type": "number"},
                "delta": {"type": "number"},
                "tlist": {"type": "array", "items": {"type": "number"}},
                "psi0_real_imag": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "items": {"type": "number"},
                        "minItems": 2,
                        "maxItems": 2,
                        "description": "For each basis amplitude: [re, im]. Order: [alpha, beta].",
                    },
                    "minItems": 2,
                    "maxItems": 2,
                },
            },
            "required": ["omega", "delta", "tlist", "psi0_real_imag"],
        },
    },
    {
        "name": "sympy_ode_solve",
        "description": "Solve an ODE analytically using SymPy's dsolve. Provide the equation as a SymPy expression equal to zero (e.g. 'Diff(y(x), x) + y(x)' for y'+y=0).",
        "input_schema": {
            "type": "object",
            "properties": {
                "equation": {"type": "string", "description": "ODE as SymPy expression equal to zero"},
                "func": {"type": "string", "default": "y", "description": "Dependent variable function name"},
                "independent_var": {"type": "string", "default": "x", "description": "Independent variable name"},
                "ics": {
                    "type": "object",
                    "description": "Optional initial conditions, e.g. {\"y(0)\": 1, \"Derivative(y(x), x)(x, 0)\": 0}",
                    "additionalProperties": {"type": "number"},
                },
            },
            "required": ["equation"],
        },
    },
    {
        "name": "scipy_ode_solve",
        "description": "Solve an ODE numerically using scipy's solve_ivp. Provide the right-hand side of dy/dx = f(x,y) as a SymPy expression.",
        "input_schema": {
            "type": "object",
            "properties": {
                "equation": {
                    "type": "string",
                    "description": "Right-hand side of dy/dx = f(x,y), or a JSON list of expressions for systems",
                },
                "func": {"type": "string", "default": "y", "description": "Dependent variable name"},
                "independent_var": {"type": "string", "default": "x", "description": "Independent variable name"},
                "t_span": {
                    "type": "array",
                    "items": {"type": "number"},
                    "default": [0.0, 10.0],
                    "description": "Integration interval [t_start, t_end]",
                },
                "y0": {
                    "type": "array",
                    "items": {"type": "number"},
                    "default": [1.0],
                    "description": "Initial condition(s)",
                },
                "t_eval": {
                    "type": "array",
                    "items": {"type": "number"},
                    "description": "Optional time points to evaluate the solution at",
                },
                "method": {
                    "type": "string",
                    "default": "RK45",
                    "enum": ["RK45", "RK23", "DOP853", "Radau", "BDF", "LSODA"],
                    "description": "Integration method",
                },
                "max_step": {"type": "number", "default": 0.1, "description": "Maximum step size"},
            },
            "required": ["equation"],
        },
    },
]
