from sqlalchemy.orm import Session

from app.models.especialidad import Especialidad


class EspecialidadRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return db.query(Especialidad).all()

    @staticmethod
    def obtener_por_id(db: Session, id_especialidad: int):
        return (
            db.query(Especialidad)
            .filter(Especialidad.idEspecialidad == id_especialidad)
            .first()
        )

    @staticmethod
    def crear(db: Session, especialidad: Especialidad):
        db.add(especialidad)
        db.commit()
        db.refresh(especialidad)
        return especialidad

    @staticmethod
    def actualizar(db: Session, especialidad: Especialidad):
        db.commit()
        db.refresh(especialidad)
        return especialidad

    @staticmethod
    def eliminar(db: Session, especialidad: Especialidad):
        db.delete(especialidad)
        db.commit()