from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uuid
import json

from app.core.orchestrator import run_orchestrator, run_orchestrator_stream

router = APIRouter()


class ChatRequest(BaseModel):
    user_message: str
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
    debug: dict = {}


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    conversation_id = req.conversation_id or str(uuid.uuid4())
    answer, debug = run_orchestrator(
        conversation_id=conversation_id,
        user_message=req.user_message,
    )
    return ChatResponse(
        conversation_id=conversation_id,
        answer=answer,
        debug=debug,
    )


@router.post("/chat/stream")
def chat_stream(req: ChatRequest):
    conversation_id = req.conversation_id or str(uuid.uuid4())

    def event_generator():
        try:
            for chunk in run_orchestrator_stream(
                conversation_id=conversation_id,
                user_message=req.user_message,
            ):
                yield f"data: {json.dumps({'text': chunk, 'done': False})}\n\n"
            yield f"data: {json.dumps({'text': '', 'done': True, 'conversation_id': conversation_id})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
