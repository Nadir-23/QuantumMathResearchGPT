import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

if settings.DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
    engine_kwargs = {}
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "quantummath.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
    engine_kwargs = {"connect_args": {"check_same_thread": False}}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
