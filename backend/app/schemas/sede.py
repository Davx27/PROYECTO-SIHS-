from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class TipoSede(str, Enum):
    PRINCIPAL = "principal"
    SECUNDARIA = "secundaria"
    ALTERNA = "alterna"


class SedeBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=150, alias="nombreSede")
    direccion: str | None = Field(default=None, max_length=255)
    tipo: TipoSede | None = Field(default=None, alias="tipoSede")

    model_config = ConfigDict(populate_by_name=True)


class SedeCreate(SedeBase):
    pass


class SedeUpdate(SedeBase):
    pass


class SedeResponse(SedeBase):
    id: int = Field(alias="idSede")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
