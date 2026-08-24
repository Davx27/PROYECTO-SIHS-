from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UsuarioRolCreate(BaseModel):
    idUsuario: UUID
    idRol: int


class UsuarioRolResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    idRol: int
    nombre: str
