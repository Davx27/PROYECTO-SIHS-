from pydantic import BaseModel, ConfigDict


class RolBase(BaseModel):
    nombre: str


class RolCreate(RolBase):
    pass


class RolUpdate(RolBase):
    pass


class RolResponse(RolBase):
    model_config = ConfigDict(from_attributes=True)

    idRol: int
