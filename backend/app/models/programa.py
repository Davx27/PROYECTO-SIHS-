from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from app.core.database import Base


class Programa(Base):
    __tablename__ = "programas"

    idPrograma = Column(Integer, primary_key=True, index=True)
    codigoPrograma = Column(String(20), unique=True, nullable=False)
    nombrePrograma = Column(String(150), unique=True, nullable=False)
    nivelFormacion = Column(String(30))
    activo = Column(Boolean, nullable=False, default=True)
    idCoordinacion = Column(Integer, ForeignKey("coordinaciones.idCoordinacion"), nullable=False)
