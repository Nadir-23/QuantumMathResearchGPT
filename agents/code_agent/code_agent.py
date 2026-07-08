"""
Code Generation Agent

Supports code generation in:
- Python / NumPy / SciPy
- SymPy
- Qiskit
- QuTiP
- PyTorch / TensorFlow
- MATLAB
- Julia
"""
from app.prompts.agent_prompts import AGENT_PROMPTS

AGENT_PROMPT = AGENT_PROMPTS["code_generation"]
