# QuantumMathResearchGPT

> **A multi-agent scientific AI assistant for Mathematics, Quantum Physics, Symbolic Computation, Numerical Simulation, and Research Assistance.**

QuantumMathResearchGPT combines Large Language Models with specialized computational tools to provide rigorous mathematical derivations, quantum simulations, symbolic calculations, scientific research support, and code generation.

Built with **FastAPI**, **Anthropic tool calling**, **SymPy**, **Qiskit**, **QuTiP**, and a **Next.js + Tailwind** frontend.

---

## ✨ Features

### 🧮 Mathematical Reasoning

* Step-by-step derivations
* Symbolic simplification
* Calculus and differential equations
* Linear algebra and matrix operations
* Tensor algebra and eigenvalue problems
* Assumption-aware solutions

### ⚛️ Quantum Physics

* Schrödinger equation
* Operators and observables
* Bra-ket notation
* Density matrices
* Quantum harmonic oscillator
* Spin systems
* Perturbation theory

### 🔬 Quantum Computing

* Qubits and quantum gates
* Bell states
* Bloch sphere
* Quantum Fourier Transform
* Grover's Algorithm
* Shor's Algorithm
* Quantum circuit simulation

### 🧠 Scientific Research Assistant

* Literature review support
* Paper summarization
* Research gap identification
* Method comparison
* Hypothesis generation
* Future work suggestions

### 💻 Code Generation

Supports:

* Python
* NumPy
* SciPy
* SymPy
* Qiskit
* QuTiP
* PyTorch
* TensorFlow
* MATLAB
* Julia

### ✅ Verification-Oriented Output

* Unit consistency checks
* Algebraic verification
* Numerical validation
* Physical consistency checks
* Assumption tracking

---

# Architecture

```text
                 User
                   │
                   ▼
          Next.js + Tailwind UI
                   │
                   ▼
               FastAPI API
                   │
                   ▼
            LangGraph Orchestrator
                   │
 ┌─────────────────┼──────────────────┐
 │                 │                  │
 ▼                 ▼                  ▼
Math Agent    Quantum Agent     Research Agent
(SymPy)       (Qiskit+QuTiP)    (ArXiv + RAG)
 │                 │                  │
 └────────────┬────┴────────────┬─────┘
              ▼                 ▼
        Code Agent         Verification Agent
              │
              ▼
         Final Answer
```

---

# Tech Stack

## Backend

* Python 3.11+
* FastAPI
* LangGraph
* Anthropic SDK

## Mathematical Engines

* SymPy
* NumPy
* SciPy

## Quantum Frameworks

* Qiskit
* QuTiP

## Research & RAG

* ArXiv API
* ChromaDB
* Qdrant
* FAISS

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

## Memory

* Redis
* PostgreSQL

---

# Tool Calling

Anthropic tool calling automatically invokes backend tools:

### Mathematical Tools

```python
sympy_simplify()
sympy_integrate()
sympy_differentiate()
sympy_solve()
sympy_matrix()
```

### Quantum Tools

```python
qiskit_create_circuit()
qiskit_simulate()
qiskit_statevector()
```

### QuTiP Tools

```python
qutip_hamiltonian()
qutip_time_evolution()
qutip_density_matrix()
```

### Research Tools

```python
arxiv_search()
paper_summary()
citation_analysis()
```

---

# Setup

## Backend

Install dependencies:

```bash
pip install -r requirements.txt
```

Create environment variables:

```bash
cp .env.example .env
```

Example:

```env
ANTHROPIC_API_KEY=your_key_here
```

Run FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

---

## Frontend

Install dependencies:

```bash
npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run development server:

```bash
npm run dev
```

---

# Usage

Start the backend:

```bash
uvicorn app.main:app --reload
```

Start the frontend:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

Example prompts:

### Mathematics

```text
Solve and verify:

x³ - 6x² + 11x - 6 = 0
```

### Quantum Physics

```text
Derive the time-independent Schrödinger equation for a particle in a box.
```

### Quantum Computing

```text
Simulate a Bell state circuit and verify expected correlations.
```

### Research

```text
Summarize recent papers on Variational Quantum Algorithms.
```

---

# API

## POST /chat

Request

```json
{
  "user_message": "Derive the evolution of a two-level system",
  "conversation_id": "optional"
}
```

Response

```json
{
  "conversation_id": "uuid",
  "answer": "formatted response",
  "debug": {}
}
```

---

# Project Structure

```text
QuantumMathResearchGPT/
│
├── app/
│   ├── api/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── main.py
│
├── agents/
│   ├── orchestrator/
│   ├── math_agent/
│   ├── quantum_agent/
│   ├── symbolic_agent/
│   ├── numerical_agent/
│   ├── research_agent/
│   ├── code_agent/
│   ├── verifier_agent/
│   └── memory_agent/
│
├── tools/
│   ├── sympy_tools.py
│   ├── qiskit_tools.py
│   ├── qutip_tools.py
│   └── arxiv_tools.py
│
├── rag/
├── frontend/
├── memory/
├── tests/
├── docs/
├── requirements.txt
└── README.md
```

---

# Roadmap

* [ ] PDF understanding
* [ ] ArXiv RAG
* [ ] Wolfram Engine integration
* [ ] LaTeX rendering
* [ ] Image-to-equation OCR
* [ ] Voice interaction
* [ ] Multi-modal capabilities
* [ ] Autonomous research workflows
* [ ] Fine-tuned scientific model

---

# License

MIT License

---

# Author

**Boukrioui Nadir**

AI Engineer • Quantum Computing Enthusiast • Scientific AI Researcher

---

> *Not just a chatbot — a Scientific Copilot for Mathematics and Quantum Physics.*
