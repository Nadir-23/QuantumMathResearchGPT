from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router

app = FastAPI(
    title="QuantumMathResearchGPT",
    description="A multi-agent scientific AI assistant for Mathematics, Quantum Physics, Symbolic Computation, Numerical Simulation, and Research Assistance.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "QuantumMathResearchGPT"}
