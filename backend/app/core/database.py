from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.core.config import settings

# client_encoding explícito: sin esto, texto con tildes/guiones largos que
# manda el frontend (ej. "—", "í") se puede guardar corrupto en Postgres
# dependiendo del locale de Windows donde corra el backend — encontrado en
# vivo el 2026-08-26 (tematica de un bloque con "—" llegó a la BD como
# "â€”", el patrón clásico de UTF-8 reinterpretado como
# Latin-1/cp1252 y vuelto a codificar).
engine = create_engine(settings.database_url, connect_args={"client_encoding": "utf8"})

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
