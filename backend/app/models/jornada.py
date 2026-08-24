from sqlalchemy import Column, Integer, String
 
from app.core.database import Base
 
 
class Jornada(Base):
    __tablename__ = "jornadas"
 
    idJornada = Column(Integer, primary_key=True, index=True)
    nombreJornada = Column(String(50), nullable=False)