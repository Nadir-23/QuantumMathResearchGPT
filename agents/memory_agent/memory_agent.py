"""
Memory Agent

Handles:
- Conversation context tracking
- User preference extraction
- Session-scoped memory (no cross-session by default)
"""
from app.prompts.agent_prompts import AGENT_PROMPTS

AGENT_PROMPT = AGENT_PROMPTS["memory"]
