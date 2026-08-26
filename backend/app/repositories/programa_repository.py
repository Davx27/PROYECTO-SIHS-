from sqlalchemy.orm import Session

from app.models.programa import Programa


class ProgramaRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return db.query(Programa).all()

    @staticmethod
    def obtener_por_id(db: Session, id_programa: int):
        return db.query(Programa).filter(Programa.idPrograma == id_programa).first()

    @staticmethod
    def crear(db: Session, programa: Programa):
        db.add(programa)
        db.commit()
        db.refresh(programa)
        return programa

    @staticmethod
    def actualizar(db: Session, programa: Programa):
        db.commit()
        db.refresh(programa)
        return programa

    @staticmethod
    def eliminar(db: Session, programa: Programa):
        db.delete(programa)
        db.commit()
