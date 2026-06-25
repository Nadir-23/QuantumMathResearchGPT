import os
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from .orchestrator import create_orchestrator

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


# Request/Response Models
class ChatRequest(BaseModel):
    user_message: str
    conversation_id: str = None


class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
    debug: dict = {}


# Initialize orchestrator
orchestrator_chain = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown"""
    global orchestrator_chain
    logger.info("Starting up QuantumMathResearchGPT...")
    orchestrator_chain = create_orchestrator()
    yield
    logger.info("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="QuantumMathResearchGPT",
    description="Multi-agent AI for Mathematics, Quantum Physics, and Scientific Research",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": "QuantumMathResearchGPT",
        "version": "1.0.0"
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint for interacting with the multi-agent system.
    
    Args:
        request: ChatRequest with user_message and optional conversation_id
        
    Returns:
        ChatResponse with conversation_id, answer, and debug info
    """
    try:
        if not orchestrator_chain:
            raise HTTPException(status_code=500, detail="Orchestrator not initialized")
        
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        logger.info(f"Processing message for conversation {conversation_id}: {request.user_message[:100]}")
        
        # Invoke the orchestrator chain
        result = orchestrator_chain.invoke({
            "messages": [{"role": "user", "content": request.user_message}],
            "conversation_id": conversation_id
        })
        
        # Extract the final response
        answer = result.get("answer", "No response generated")
        debug = result.get("debug", {})
        
        return ChatResponse(
            conversation_id=conversation_id,
            answer=answer,
            debug=debug
        )
        
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
