from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.sede import Sede
from app.schemas.sede import SedeCreate, SedeUpdate


class SedeRepository:
    def list(self, db: Session) -> list[Sede]:
        return list(db.scalars(select(Sede).order_by(Sede.id)).all())

    def get(self, db: Session, sede_id: int) -> Sede | None:
        return db.get(Sede, sede_id)

    def create(self, db: Session, data: SedeCreate) -> Sede:
        sede = Sede(**data.model_dump(by_alias=False))
        db.add(sede)
        db.commit()
        db.refresh(sede)
        return sede

    def update(self, db: Session, sede: Sede, data: SedeUpdate) -> Sede:
        for field, value in data.model_dump(by_alias=False).items():
            setattr(sede, field, value)
        db.commit()
        db.refresh(sede)
        return sede

    def delete(self, db: Session, sede: Sede) -> None:
        db.delete(sede)
        db.commit()
