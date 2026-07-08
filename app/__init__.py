try:
    from app.config import settings
except Exception:
    settings = None

__all__ = ["settings"]
