from sqlalchemy.orm import Session

from app.models.jornada import Jornada


class JornadaRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return db.query(Jornada).all()

    @staticmethod
    def obtener_por_id(db: Session, id_jornada: int):
        return db.query(Jornada).filter(Jornada.idJornada == id_jornada).first()

    @staticmethod
    def crear(db: Session, jornada: Jornada):
        db.add(jornada)
        db.commit()
        db.refresh(jornada)
        return jornada

    @staticmethod
    def actualizar(db: Session, jornada: Jornada):
        db.commit()
        db.refresh(jornada)
        return jornada

    @staticmethod
    def eliminar(db: Session, jornada: Jornada):
        db.delete(jornada)
        db.commit()