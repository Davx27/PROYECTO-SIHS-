from pydantic import BaseModel, ConfigDict


class ProgramaBase(BaseModel):
    codigoPrograma: str
    nombrePrograma: str
    nivelFormacion: str | None = None
    activo: bool = True
    idCoordinacion: int


class ProgramaCreate(ProgramaBase):
    pass


class ProgramaUpdate(ProgramaBase):
    pass


class ProgramaResponse(ProgramaBase):
    model_config = ConfigDict(from_attributes=True)

    idPrograma: int
