from typing import Optional

from pydantic import BaseModel, ConfigDict


class EspecialidadBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    activo: bool = True


class EspecialidadCreate(EspecialidadBase):
    pass


class EspecialidadUpdate(EspecialidadBase):
    pass


class EspecialidadResponse(EspecialidadBase):
    model_config = ConfigDict(from_attributes=True)

    idEspecialidad: int