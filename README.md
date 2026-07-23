```
   ____    __  _______        __________  ______
  / __ \  /  |/  / __ \      / ____/ __ \/_  __/
 / / / / / /|_/ / /_/ /_____/ / __/ /_/ / / /   
/ /_/ / / /  / / _, _/_____/ /_/ / ____/ / /    
\___\_\/_/  /_/_/ |_|      \____/_/     /_/     
```

# ⚛️ QuantumMathResearchGPT

### *A Multi-Agent Scientific Copilot for Mathematics, Quantum Physics & Research*

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](#-tech-stack)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](#-tech-stack)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#-tech-stack)
[![Qiskit](https://img.shields.io/badge/Qiskit-Quantum-6929C4?style=for-the-badge&logo=qiskit&logoColor=white)](#-tech-stack)
[![SymPy](https://img.shields.io/badge/SymPy-Symbolic_Math-3B5526?style=for-the-badge)](#-tech-stack)
[![Anthropic](https://img.shields.io/badge/Anthropic-Tool_Calling-D97757?style=for-the-badge)](#-tool-calling)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#-license)

> *"A derivation is only as trustworthy as its weakest assumption. QuantumMathResearchGPT exists to carry every equation — symbolic, numeric, and physical — through to a verified answer, not just a plausible-looking one."*

---

## 🧭 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Agent Workflow](#-agent-workflow)
- [Tech Stack](#-tech-stack)
- [Tool Calling](#-tool-calling)
- [Setup](#-setup)
- [Usage](#️-usage)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Roadmap](#️-roadmap)
- [Author](#-author)

---

## 🌌 Overview

**QuantumMathResearchGPT** combines Large Language Models with specialized computational tools to provide rigorous mathematical derivations, quantum simulations, symbolic calculations, scientific research support, and code generation.

| | |
|---|---|
| 🧠 **Reasoning engine** | Anthropic Claude, tool-calling based |
| 🔀 **Orchestration** | LangGraph multi-agent graph |
| 🧮 **Math** | SymPy · NumPy · SciPy |
| ⚛️ **Quantum** | Qiskit · QuTiP |
| 📚 **Research** | ArXiv API + hybrid RAG |
| 🖥️ **Frontend** | Next.js 15 · Tailwind · shadcn/ui |
| 💾 **Memory** | Redis · PostgreSQL |

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🧮 Mathematical Reasoning
- Step-by-step derivations
- Symbolic simplification
- Calculus and differential equations
- Linear algebra and matrix operations
- Tensor algebra and eigenvalue problems
- Assumption-aware solutions

### ⚛️ Quantum Physics
- Schrödinger equation
- Operators and observables
- Bra-ket notation
- Density matrices
- Quantum harmonic oscillator
- Spin systems
- Perturbation theory

</td>
<td width="50%" valign="top">

### 🔬 Quantum Computing
- Qubits and quantum gates
- Bell states
- Bloch sphere
- Quantum Fourier Transform
- Grover's Algorithm
- Shor's Algorithm
- Quantum circuit simulation

### 🧠 Scientific Research Assistant
- Literature review support
- Paper summarization
- Research gap identification
- Method comparison
- Hypothesis generation
- Future work suggestions

</td>
</tr>
</table>

| ✅ Verification-Oriented Output |
|---|
| Unit consistency checks · Algebraic verification · Numerical validation · Physical consistency checks · Assumption tracking |

<details>
<summary><b>💻 Code Generation — click to expand supported stacks</b></summary>
<br>

| Language / Framework | Use Case |
|---|---|
| Python | General scientific scripting |
| NumPy / SciPy | Numerical computation |
| SymPy | Symbolic mathematics |
| Qiskit | Quantum circuit design |
| QuTiP | Open quantum system dynamics |
| PyTorch / TensorFlow | ML-based research workflows |
| MATLAB | Engineering-style simulations |
| Julia | High-performance numerics |

</details>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client Layer"]
        UI[Next.js + Tailwind UI]
    end

    subgraph API["⚙️ Backend API — FastAPI"]
        EP["/chat endpoint"]
        TC["Anthropic Tool Calling"]
    end

    subgraph ORCH["🧭 LangGraph Orchestrator"]
        ROUTER{Route by intent}
    end

    subgraph AGENTS["🤖 Specialist Agents"]
        MATH["🧮 Math Agent<br/>SymPy"]
        QUANT["⚛️ Quantum Agent<br/>Qiskit + QuTiP"]
        RES["📚 Research Agent<br/>ArXiv + RAG"]
    end

    subgraph FINALIZE["🔎 Finalization"]
        CODE["💻 Code Agent"]
        VERIFY["✅ Verification Agent"]
    end

    MEM[(💾 Redis + PostgreSQL<br/>Memory)]

    UI --> EP --> TC --> ROUTER
    ROUTER --> MATH
    ROUTER --> QUANT
    ROUTER --> RES
    MATH --> CODE
    QUANT --> CODE
    RES --> CODE
    MATH --> VERIFY
    QUANT --> VERIFY
    RES --> VERIFY
    CODE --> VERIFY
    VERIFY --> ANSWER["📤 Final Answer"]
    ANSWER --> UI
    ORCH -.-> MEM
```

---

## 🔄 Agent Workflow

Example: a user asks to *"derive the evolution of a two-level system and simulate it."*

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js UI
    participant API as FastAPI /chat
    participant LG as LangGraph Orchestrator
    participant MA as Math Agent
    participant QA as Quantum Agent
    participant VA as Verification Agent

    User->>UI: "Derive the evolution of a two-level system"
    UI->>API: POST /chat
    API->>LG: forward request + conversation_id
    LG->>MA: sympy_solve() — derive the ODE system
    MA-->>LG: symbolic derivation
    LG->>QA: qutip_time_evolution() — simulate result
    QA-->>LG: numerical simulation + Bloch trajectory
    LG->>VA: cross-check units, algebra, physical consistency
    VA-->>LG: verified ✅
    LG-->>API: composed answer
    API-->>UI: formatted response
    UI-->>User: derivation + simulation + verification notes
```

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| 🐍 **Backend** | ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![LangGraph](https://img.shields.io/badge/-LangGraph-1C3C3C?style=flat-square) |
| 🧮 **Math Engines** | ![SymPy](https://img.shields.io/badge/-SymPy-3B5526?style=flat-square) ![NumPy](https://img.shields.io/badge/-NumPy-013243?style=flat-square&logo=numpy&logoColor=white) ![SciPy](https://img.shields.io/badge/-SciPy-8CAAE6?style=flat-square&logo=scipy&logoColor=white) |
| ⚛️ **Quantum Frameworks** | ![Qiskit](https://img.shields.io/badge/-Qiskit-6929C4?style=flat-square&logo=qiskit&logoColor=white) ![QuTiP](https://img.shields.io/badge/-QuTiP-FF6F00?style=flat-square) |
| 📚 **Research & RAG** | ![ArXiv](https://img.shields.io/badge/-ArXiv_API-B31B1B?style=flat-square&logo=arxiv&logoColor=white) ![ChromaDB](https://img.shields.io/badge/-ChromaDB-FF6F61?style=flat-square) ![Qdrant](https://img.shields.io/badge/-Qdrant-DC244C?style=flat-square) ![FAISS](https://img.shields.io/badge/-FAISS-4267B2?style=flat-square) |
| 🖥️ **Frontend** | ![Next.js](https://img.shields.io/badge/-Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/-shadcn%2Fui-000000?style=flat-square) |
| 💾 **Memory** | ![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) |

---

## 🔧 Tool Calling

Anthropic tool calling automatically invokes the right backend tool based on the query — no manual routing required.

```mermaid
flowchart LR
    Q[Incoming query] --> D{Anthropic<br/>tool-call decision}
    D -->|math expression| M[sympy_* tools]
    D -->|circuit / gates| QK[qiskit_* tools]
    D -->|Hamiltonian / dynamics| QT[qutip_* tools]
    D -->|papers / literature| AR[arxiv_* tools]
    M & QK & QT & AR --> V[Verification Agent]
    V --> A[Final Answer]
```

<details>
<summary><b>🧮 Mathematical Tools</b></summary>

```python
sympy_simplify()
sympy_integrate()
sympy_differentiate()
sympy_solve()
sympy_matrix()
```
</details>

<details>
<summary><b>🔬 Quantum Tools (Qiskit)</b></summary>

```python
qiskit_create_circuit()
qiskit_simulate()
qiskit_statevector()
```
</details>

<details>
<summary><b>⚛️ QuTiP Tools</b></summary>

```python
qutip_hamiltonian()
qutip_time_evolution()
qutip_density_matrix()
```
</details>

<details>
<summary><b>📚 Research Tools</b></summary>

```python
arxiv_search()
paper_summary()
citation_analysis()
```
</details>

---

## 🚀 Setup

### Prerequisites

```
Python  >= 3.11
Node.js >= 18.0.0
Redis   >= 7.0
PostgreSQL >= 14
```

### Backend

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment variables
cp .env.example .env
```

`.env`
```env
ANTHROPIC_API_KEY=your_key_here
```

```bash
# 3. Run the API
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
# 1. Install dependencies
npm install
```

`.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# 2. Run the dev server
npm run dev
```

---

## ▶️ Usage

```bash
# Terminal 1 — backend
uvicorn app.main:app --reload

# Terminal 2 — frontend
npm run dev
```

Then open **http://localhost:3000**.

### 💡 Example Prompts

| Domain | Prompt |
|---|---|
| 📐 Mathematics | *Solve and verify:* `x³ - 6x² + 11x - 6 = 0` |
| ⚛️ Quantum Physics | *Derive the time-independent Schrödinger equation for a particle in a box.* |
| 🔬 Quantum Computing | *Simulate a Bell state circuit and verify expected correlations.* |
| 📚 Research | *Summarize recent papers on Variational Quantum Algorithms.* |

---

## 📡 API Reference

### `POST /chat`

**Request**
```json
{
  "user_message": "Derive the evolution of a two-level system",
  "conversation_id": "optional"
}
```

**Response**
```json
{
  "conversation_id": "uuid",
  "answer": "formatted response",
  "debug": {}
}
```

---

## 📁 Project Structure

```
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

## 🗺️ Roadmap

- [ ] PDF understanding
- [ ] ArXiv RAG
- [ ] Wolfram Engine integration
- [ ] LaTeX rendering
- [ ] Image-to-equation OCR
- [ ] Voice interaction
- [ ] Multi-modal capabilities
- [ ] Autonomous research workflows
- [ ] Fine-tuned scientific model

---

## 📜 License

Distributed under the **MIT License**.

---

## 👤 Author

**Boukrioui Nadir**
*AI Engineer • Quantum Computing Enthusiast • Scientific AI Researcher*

[![Morocco](https://img.shields.io/badge/🇲🇦-Morocco-C1272D?style=for-the-badge)]()
[![ENSIASD](https://img.shields.io/badge/ENSIASD-Taroudant-8A2BE2?style=for-the-badge)]()

---

<div align="center">

*Not just a chatbot — a Scientific Copilot for Mathematics and Quantum Physics.*

</div>
