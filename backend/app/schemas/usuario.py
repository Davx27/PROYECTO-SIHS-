from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class UsuarioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    idUsuario: UUID
    nombre: str
    email: EmailStr
    estado: str
    fechaRegistro: datetime
