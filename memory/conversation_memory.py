"""
Conversation Memory

Simple in-memory store for conversation history.
Replace with Redis or PostgreSQL for production.
"""
from typing import Any, Dict, List


class ConversationMemory:
    def __init__(self):
        self._store: Dict[str, List[Dict[str, Any]]] = {}

    def get(self, conversation_id: str) -> List[Dict[str, Any]]:
        return self._store.get(conversation_id, [])

    def append(self, conversation_id: str, message: Dict[str, Any]) -> None:
        if conversation_id not in self._store:
            self._store[conversation_id] = []
        self._store[conversation_id].append(message)

    def clear(self, conversation_id: str) -> None:
        self._store.pop(conversation_id, None)


# Global singleton
memory = ConversationMemory()
