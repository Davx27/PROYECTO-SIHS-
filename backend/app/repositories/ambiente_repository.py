from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.ambiente import Ambiente
from app.schemas.ambiente import AmbienteCreate, AmbienteUpdate


class AmbienteRepository:
    def list(self, db: Session, sede_id: int | None = None) -> list[Ambiente]:
        query = select(Ambiente).order_by(Ambiente.id)
        if sede_id is not None:
            query = query.where(Ambiente.sede_id == sede_id)
        return list(db.scalars(query).all())

    def get(self, db: Session, ambiente_id: int) -> Ambiente | None:
        return db.get(Ambiente, ambiente_id)

    def create(self, db: Session, data: AmbienteCreate) -> Ambiente:
        ambiente = Ambiente(**data.model_dump(by_alias=False))
        db.add(ambiente)
        db.commit()
        db.refresh(ambiente)
        return ambiente

    def update(self, db: Session, ambiente: Ambiente, data: AmbienteUpdate) -> Ambiente:
        for field, value in data.model_dump(by_alias=False).items():
            setattr(ambiente, field, value)
        db.commit()
        db.refresh(ambiente)
        return ambiente

    def delete(self, db: Session, ambiente: Ambiente) -> None:
        db.delete(ambiente)
        db.commit()
