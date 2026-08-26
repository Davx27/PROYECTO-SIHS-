from pydantic import BaseModel, ConfigDict


class CompetenciaFormacionBase(BaseModel):
    codigo: str | None = None
    descripcion: str
    idPrograma: int


class CompetenciaFormacionCreate(CompetenciaFormacionBase):
    pass


class CompetenciaFormacionUpdate(CompetenciaFormacionBase):
    pass


class CompetenciaFormacionResponse(CompetenciaFormacionBase):
    model_config = ConfigDict(from_attributes=True)

    idCompetencia: int
