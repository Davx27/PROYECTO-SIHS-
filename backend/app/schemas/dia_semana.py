from pydantic import BaseModel, ConfigDict


class DiaSemanaBase(BaseModel):
    nombreDia: str


class DiaSemanaCreate(DiaSemanaBase):
    pass


class DiaSemanaUpdate(DiaSemanaBase):
    pass


class DiaSemanaResponse(DiaSemanaBase):
    model_config = ConfigDict(from_attributes=True)

    idDia: int