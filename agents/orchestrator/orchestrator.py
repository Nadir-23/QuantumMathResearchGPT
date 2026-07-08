"""
Orchestrator Agent

Routes tasks to specialized agents and aggregates results.
Manages the tool-calling loop via the core orchestrator.
"""
from app.core.orchestrator import run_orchestrator

__all__ = ["run_orchestrator"]
