from pydantic import BaseModel, ConfigDict


class CoordinacionBase(BaseModel):
    nombreCoordinacion: str


class CoordinacionCreate(CoordinacionBase):
    pass


class CoordinacionUpdate(CoordinacionBase):
    pass


class CoordinacionResponse(CoordinacionBase):
    model_config = ConfigDict(from_attributes=True)

    idCoordinacion: int
