from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class HorarioGuardado(Base):
    """Lo que arma el editor visual (frontend/src/pages/NuevoHorario.tsx),
    guardado tal cual. NO es la tabla "horarios" relacional (esa exige FKs
    reales a ambiente/instructor/ficha/resultado para detectar cruces, que
    es el objetivo real del proyecto) — el editor hoy captura ficha/
    instructor/ambiente como texto libre, así que se guarda en JSONB hasta
    que ese módulo exista. Ver
    _Docs/Documentación general/SECCION_ESTUDIANTES.md."""

    __tablename__ = "horarios_guardados"

    idHorarioGuardado = Column(Integer, primary_key=True, index=True)
    idUsuario = Column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.idUsuario", ondelete="CASCADE"),
        nullable=False,
    )

    ficha = Column(String(100), nullable=False)
    aprendices = Column(String(20))
    horasTrimestre = Column(String(20))
    fechaInicio = Column(Date)
    fechaFin = Column(Date)

    bloques = Column(JSONB, nullable=False)
    grid = Column(JSONB, nullable=False)

    fechaCreacion = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario")
