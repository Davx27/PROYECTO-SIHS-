from sqlalchemy import Column, ForeignKey, Integer, String

from app.core.database import Base


class Guia(Base):
    __tablename__ = "guias"

    idGuia = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), nullable=False)
    idPrograma = Column(Integer, ForeignKey("programas.idPrograma"), nullable=False)
    idTrimestre = Column(Integer, ForeignKey("trimestres.idTrimestre"), nullable=False)
