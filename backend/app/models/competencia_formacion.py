from sqlalchemy import Column, ForeignKey, Integer, String, Text

from app.core.database import Base


class CompetenciaFormacion(Base):
    __tablename__ = "competencias_formacion"

    idCompetencia = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50))
    descripcion = Column(Text, nullable=False)
    idPrograma = Column(Integer, ForeignKey("programas.idPrograma"), nullable=False)
