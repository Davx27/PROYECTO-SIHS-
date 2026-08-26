from sqlalchemy import Column, ForeignKey, Integer, String, Text

from app.core.database import Base


class ResultadoAprendizaje(Base):
    __tablename__ = "resultados_aprendizaje"

    idResultado = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50))
    descripcion = Column(Text, nullable=False)
    idCompetencia = Column(Integer, ForeignKey("competencias_formacion.idCompetencia"), nullable=False)
    # Nullable a propósito: no todos los programas tienen esta capa
    # digitalizada todavía — ver PLAN_INTEGRACION_LOGICA_Y_BD.md §2.1.
    idGuia = Column(Integer, ForeignKey("guias.idGuia"))
    horasAsignadas = Column(Integer)
