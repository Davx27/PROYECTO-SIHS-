from pydantic import BaseModel, ConfigDict


class JornadaBase(BaseModel):
    nombreJornada: str


class JornadaCreate(JornadaBase):
    pass


class JornadaUpdate(JornadaBase):
    pass


class JornadaResponse(JornadaBase):
    model_config = ConfigDict(from_attributes=True)

    idJornada: int