from pydantic import BaseModel, ConfigDict


class FichaBase(BaseModel):
    codigoFicha: str
    idPrograma: int
    idTrimestre: int


class FichaCreate(FichaBase):
    pass


class FichaUpdate(FichaBase):
    pass


class FichaResponse(FichaBase):
    model_config = ConfigDict(from_attributes=True)

    idFicha: int
