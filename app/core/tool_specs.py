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
]
