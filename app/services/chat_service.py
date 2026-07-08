"""Chat Service - business logic layer between API route and orchestrator."""
from typing import Any, Dict, Tuple
from app.core.orchestrator import run_orchestrator


def process_chat(conversation_id: str, user_message: str) -> Tuple[str, Dict[str, Any]]:
    return run_orchestrator(conversation_id=conversation_id, user_message=user_message)
