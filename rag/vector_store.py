"""
Vector Store Interface

Placeholder for vector database integrations (ChromaDB / Qdrant / FAISS).
"""
from typing import Any, Dict, List


class VectorStore:
    """Abstract vector store interface."""

    def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        raise NotImplementedError

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        raise NotImplementedError
