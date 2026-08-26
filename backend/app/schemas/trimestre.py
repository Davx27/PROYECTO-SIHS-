from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict

EstadoTrimestre = Literal["planeado", "activo", "finalizado"]


class TrimestreBase(BaseModel):
    nombre: str
    fechaInicio: date
    fechaFin: date
    estado: EstadoTrimestre = "planeado"


class TrimestreCreate(TrimestreBase):
    pass


class TrimestreUpdate(TrimestreBase):
    pass


class TrimestreResponse(TrimestreBase):
    model_config = ConfigDict(from_attributes=True)

    idTrimestre: int
