from pydantic import BaseModel, ConfigDict


class GuiaBase(BaseModel):
    codigo: str
    idPrograma: int
    idTrimestre: int


class GuiaCreate(GuiaBase):
    pass


class GuiaUpdate(GuiaBase):
    pass


class GuiaResponse(GuiaBase):
    model_config = ConfigDict(from_attributes=True)

    idGuia: int
