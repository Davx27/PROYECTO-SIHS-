from sqlalchemy import Column, Integer, String

from app.core.database import Base


class Coordinacion(Base):
    __tablename__ = "coordinaciones"

    idCoordinacion = Column(Integer, primary_key=True, index=True)
    nombreCoordinacion = Column(String(150), nullable=False)
