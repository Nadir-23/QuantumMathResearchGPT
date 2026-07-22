from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
import time
import logging

from app.config import settings
from app.api.chat import router as chat_router
from app.api.math import router as math_router
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.models.database import init_db, SessionLocal
from app.core.rate_limiter import limiter
from app.auth.middleware import AuditLogMiddleware
from app.auth.seed import seed_roles_and_permissions, seed_demo_accounts

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="QuantumMathResearchGPT",
    description="A multi-agent scientific AI assistant for Mathematics, Quantum Physics, Symbolic Computation, Numerical Simulation, and Research Assistance.",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)

app.add_middleware(AuditLogMiddleware)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    response.headers["X-Process-Time"] = str(round(process_time, 4))
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
    return response


app.include_router(chat_router)
app.include_router(math_router)
app.include_router(auth_router)
app.include_router(admin_router)


@app.on_event("startup")
def startup_event():
    init_db()
    db = SessionLocal()
    try:
        seed_roles_and_permissions(db)
        if settings.ENVIRONMENT == "development":
            seed_demo_accounts(db)
    except Exception as e:
        logger.warning(f"Seed skipped or failed: {e}")
    finally:
        db.close()


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "QuantumMathResearchGPT", "environment": settings.ENVIRONMENT}


@app.get("/")
async def root():
    return {"message": "QuantumMathResearchGPT API", "docs": "/docs" if settings.ENVIRONMENT == "development" else "disabled"}
