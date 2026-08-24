from sqlalchemy.orm import Session

from app.models.dia_semana import DiaSemana


class DiaSemanaRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return db.query(DiaSemana).all()

    @staticmethod
    def obtener_por_id(db: Session, id_dia: int):
        return db.query(DiaSemana).filter(DiaSemana.idDia == id_dia).first()

    @staticmethod
    def crear(db: Session, dia: DiaSemana):
        db.add(dia)
        db.commit()
        db.refresh(dia)
        return dia

    @staticmethod
    def actualizar(db: Session, dia: DiaSemana):
        db.commit()
        db.refresh(dia)
        return dia

    @staticmethod
    def eliminar(db: Session, dia: DiaSemana):
        db.delete(dia)
        db.commit()