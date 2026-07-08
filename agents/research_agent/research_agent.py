"""
Research Agent

Handles:
- Literature review support
- Paper summarization (factual only)
- Research gap identification
- Method comparison
- Hypothesis generation

Note: No fabricated citations. Only truthful statements.
"""
from app.prompts.agent_prompts import AGENT_PROMPTS

AGENT_PROMPT = AGENT_PROMPTS["research"]
