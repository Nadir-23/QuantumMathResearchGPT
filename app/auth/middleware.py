"""Audit logging middleware — records every authenticated API action."""

from __future__ import annotations

import json
import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from app.models.database import SessionLocal
from app.auth.models import AuditLog
from app.core.security import decode_token


class AuditLogMiddleware(BaseHTTPMiddleware):
    """Logs every request that carries a valid JWT to the audit_logs table."""

    SKIP_PATHS = frozenset({"/health", "/", "/docs", "/redoc", "/openapi.json"})
    SKIP_METHODS = frozenset({"OPTIONS", "HEAD"})

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.method in self.SKIP_METHODS or request.url.path in self.SKIP_PATHS:
            return await call_next(request)

        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 2)

        try:
            self._log(request, response, duration_ms)
        except Exception:
            pass

        return response

    def _log(self, request: Request, response: Response, duration_ms: float) -> None:
        auth_header = request.headers.get("authorization", "")
        user_id: int | None = None
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            payload = decode_token(token)
            if payload and payload.get("type") == "access":
                try:
                    user_id = int(payload.get("sub", 0))
                except (TypeError, ValueError):
                    pass

        if user_id is None:
            return

        path_parts = [p for p in request.url.path.strip("/").split("/") if p]
        resource = path_parts[0] if path_parts else "unknown"
        action = request.method.lower()

        db = SessionLocal()
        try:
            log = AuditLog(
                user_id=user_id,
                action=action,
                resource=resource,
                resource_id="/".join(path_parts[1:]) if len(path_parts) > 1 else None,
                details=json.dumps({
                    "path": request.url.path,
                    "method": request.method,
                    "status": response.status_code,
                    "duration_ms": duration_ms,
                    "query": str(request.query_params) if request.query_params else None,
                }),
                ip_address=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent", ""),
                status_code=response.status_code,
            )
            db.add(log)
            db.commit()
        except Exception:
            db.rollback()
        finally:
            db.close()
