from sqlalchemy.orm import Session

from app.models.resultado_aprendizaje import ResultadoAprendizaje


class ResultadoAprendizajeRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return db.query(ResultadoAprendizaje).all()

    @staticmethod
    def obtener_por_id(db: Session, id_resultado: int):
        return db.query(ResultadoAprendizaje).filter(ResultadoAprendizaje.idResultado == id_resultado).first()

    @staticmethod
    def crear(db: Session, resultado: ResultadoAprendizaje):
        db.add(resultado)
        db.commit()
        db.refresh(resultado)
        return resultado

    @staticmethod
    def actualizar(db: Session, resultado: ResultadoAprendizaje):
        db.commit()
        db.refresh(resultado)
        return resultado

    @staticmethod
    def eliminar(db: Session, resultado: ResultadoAprendizaje):
        db.delete(resultado)
        db.commit()
