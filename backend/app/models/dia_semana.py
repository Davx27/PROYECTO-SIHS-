from sqlalchemy import Column, Integer, String
 
from app.core.database import Base
 
 
class DiaSemana(Base):
    # El nombre de la tabla lleva comillas en el SQL ("diasDeLaSemana")
    # porque está en camelCase; hay que respetar el nombre exacto acá.
    __tablename__ = "diasDeLaSemana"
 
    idDia = Column(Integer, primary_key=True, index=True)
    nombreDia = Column(String(10), unique=True, nullable=False)