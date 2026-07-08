# QuantumMathResearchGPT — Developer Documentation

## Architecture Overview

```
User
 │
 ▼
Next.js + Tailwind UI (frontend/)
 │
 ▼
FastAPI API (app/main.py)
 │
 ▼
LangGraph Orchestrator (app/core/orchestrator.py)
 │
 ┌──────────────────┬──────────────────┐
 ▼                  ▼                  ▼
Math Agent     Quantum Agent     Research Agent
(SymPy)        (Qiskit+QuTiP)    (ArXiv + RAG)
 │                  │                  │
 └──────────────────┴──────────────────┘
              │                │
              ▼                ▼
        Code Agent      Verification Agent
              │
              ▼
         Final Answer
```

## Agents

| Agent | Responsibility |
|-------|---------------|
| Orchestrator | Routes tasks, runs tool loop, aggregates results |
| Math Agent | Step-by-step derivations, linear algebra |
| Quantum Agent | Schrödinger eq, bra-ket, density matrices |
| Symbolic Agent | SymPy exact computation |
| Numerical Agent | QuTiP / Qiskit simulations |
| Research Agent | Factual summaries, literature review |
| Code Agent | Python / Julia / MATLAB code generation |
| Verifier Agent | Unit checks, algebraic consistency |
| Memory Agent | Conversation context management |

## Tools

| Tool | Backend | Purpose |
|------|---------|---------|
| `sympy_simplify_expr` | SymPy | Symbolic simplification |
| `sympy_integrate_expr` | SymPy | Indefinite integrals |
| `sympy_solve_equation` | SymPy | Exact equation solving |
| `qiskit_simulate_statevector` | Qiskit | Quantum circuit simulation |
| `qutip_time_evolution_two_level` | QuTiP | Two-level system evolution |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `GEMINI_MODEL` | Model to use (default: `gemini-2.5-flash`) |
| `NEXT_PUBLIC_API_URL` | Backend URL for the frontend |

## Running Tests

```bash
pip install pytest
pytest tests/
```
