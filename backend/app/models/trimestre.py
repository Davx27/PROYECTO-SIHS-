from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.dialects.postgresql import ENUM

from app.core.database import Base

estado_trimestre = ENUM(
    "planeado", "activo", "finalizado",
    name="estado_trimestre",
    create_type=False,
)


class Trimestre(Base):
    __tablename__ = "trimestres"

    idTrimestre = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(20), nullable=False)
    fechaInicio = Column(Date, nullable=False)
    fechaFin = Column(Date, nullable=False)
    estado = Column(estado_trimestre, default="planeado")
