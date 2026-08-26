from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Ambiente(Base):
    __tablename__ = "ambientes"
    __table_args__ = (
        UniqueConstraint("numeroAmbiente", "idSede", name="uqAmbienteNumeroSede"),
        CheckConstraint('"tipoAmbiente" IN (\'regular\', \'especial\')', name="ckTipoAmbiente"),
        CheckConstraint('"estadoAmbiente" IN (\'disponible\', \'mantenimiento\', \'inactivo\')', name="ckEstadoAmbiente"),
        CheckConstraint('"tipoAmbiente" = \'especial\' OR "nombreAmbiente" = \'Ambiente\'', name="nombreAmbienteRegular"),
    )

    id: Mapped[int] = mapped_column("idAmbiente", Integer, primary_key=True)
    numero_ambiente: Mapped[int] = mapped_column("numeroAmbiente", Integer, nullable=False)
    nombre: Mapped[str] = mapped_column("nombreAmbiente", String(100), nullable=False)
    tipo_ambiente: Mapped[str] = mapped_column("tipoAmbiente", String(20), nullable=False)
    estado_ambiente: Mapped[str] = mapped_column("estadoAmbiente", String(30), nullable=False, default="disponible")
    sede_id: Mapped[int] = mapped_column("idSede", ForeignKey("sedes.idSede"), nullable=False)

    sede: Mapped["Sede"] = relationship(back_populates="ambientes")


from app.models.sede import Sede
