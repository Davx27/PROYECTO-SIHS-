from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Sede(Base):
    __tablename__ = "sedes"

    id: Mapped[int] = mapped_column("idSede", Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column("nombreSede", String(150), nullable=False)
    direccion: Mapped[str | None] = mapped_column(String(255))
    tipo: Mapped[str | None] = mapped_column("tipoSede", Enum("principal", "secundaria", "alterna", name="tipo_sede", create_type=False))

    ambientes: Mapped[list["Ambiente"]] = relationship(back_populates="sede")


from app.models.ambiente import Ambiente
