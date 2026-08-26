from sqlalchemy.orm import Session

from app.models.guia import Guia


class GuiaRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return db.query(Guia).all()

    @staticmethod
    def obtener_por_id(db: Session, id_guia: int):
        return db.query(Guia).filter(Guia.idGuia == id_guia).first()

    @staticmethod
    def crear(db: Session, guia: Guia):
        db.add(guia)
        db.commit()
        db.refresh(guia)
        return guia

    @staticmethod
    def actualizar(db: Session, guia: Guia):
        db.commit()
        db.refresh(guia)
        return guia

    @staticmethod
    def eliminar(db: Session, guia: Guia):
        db.delete(guia)
        db.commit()
