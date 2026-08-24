from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class UsuarioRol(Base):
    __tablename__ = "usuario_rol"

    idUsuario = Column(UUID(as_uuid=True), ForeignKey("usuarios.idUsuario"), primary_key=True)
    idRol = Column(Integer, ForeignKey("roles.idRol"), primary_key=True)
