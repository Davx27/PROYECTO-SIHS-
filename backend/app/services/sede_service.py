from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.repositories.sede_repository import SedeRepository
from app.schemas.sede import SedeCreate, SedeUpdate


class SedeService:
    def __init__(self, repository: SedeRepository | None = None) -> None:
        self.repository = repository or SedeRepository()

    def list(self, db: Session):
        return self.repository.list(db)

    def get(self, db: Session, sede_id: int):
        sede = self.repository.get(db, sede_id)
        if sede is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="La sede no existe.")
        return sede

    def create(self, db: Session, data: SedeCreate):
        try:
            return self.repository.create(db, data)
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="No se pudo crear la sede.") from None

    def update(self, db: Session, sede_id: int, data: SedeUpdate):
        sede = self.get(db, sede_id)
        try:
            return self.repository.update(db, sede, data)
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="No se pudo actualizar la sede.") from None

    def delete(self, db: Session, sede_id: int):
        sede = self.get(db, sede_id)
        try:
            self.repository.delete(db, sede)
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="No se puede eliminar una sede con ambientes asociados.") from None
