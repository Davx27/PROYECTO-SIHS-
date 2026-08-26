from sqlalchemy.orm import Session

from app.models.coordinacion import Coordinacion


class CoordinacionRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return db.query(Coordinacion).all()

    @staticmethod
    def obtener_por_id(db: Session, id_coordinacion: int):
        return db.query(Coordinacion).filter(Coordinacion.idCoordinacion == id_coordinacion).first()

    @staticmethod
    def crear(db: Session, coordinacion: Coordinacion):
        db.add(coordinacion)
        db.commit()
        db.refresh(coordinacion)
        return coordinacion

    @staticmethod
    def actualizar(db: Session, coordinacion: Coordinacion):
        db.commit()
        db.refresh(coordinacion)
        return coordinacion

    @staticmethod
    def eliminar(db: Session, coordinacion: Coordinacion):
        db.delete(coordinacion)
        db.commit()
