from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base
from app.models.especialidad import usuario_especialidad


class Usuario(Base):
    """Perfil del dominio SIHS. La autenticación (password, sesiones,
    recuperación de contraseña) vive en auth.users, administrada por
    Supabase Auth — "idUsuario" es el mismo UUID que ese usuario allá."""

    __tablename__ = "usuarios"

    idUsuario = Column(UUID(as_uuid=True), primary_key=True)

    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)

    estado = Column(
        Enum("activo", "inactivo", name="estado_usuario"),
        default="activo",
    )

    fechaRegistro = Column(DateTime(timezone=True), server_default=func.now())

    roles = relationship(
        "Rol",
        secondary="usuario_rol",
        back_populates="usuarios",
    )

    especialidades = relationship(
        "Especialidad",
        secondary=usuario_especialidad,
        back_populates="usuarios",
    )
