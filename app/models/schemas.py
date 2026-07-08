from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class ChatRequest(BaseModel):
    user_message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
    debug: Dict[str, Any] = {}


class ToolCall(BaseModel):
    tool_id: str
    name: str
    input: Dict[str, Any]
    result: Dict[str, Any]


class DebugInfo(BaseModel):
    conversation_id: str
    tool_calls: List[ToolCall] = []
