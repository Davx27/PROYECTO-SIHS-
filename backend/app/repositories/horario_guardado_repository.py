from sqlalchemy.orm import Session, joinedload

from app.models.horario_guardado import HorarioGuardado


class HorarioGuardadoRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return (
            db.query(HorarioGuardado)
            .options(joinedload(HorarioGuardado.usuario))
            .order_by(HorarioGuardado.fechaCreacion.desc())
            .all()
        )

    @staticmethod
    def obtener_por_id(db: Session, id_horario_guardado: int):
        return (
            db.query(HorarioGuardado)
            .options(joinedload(HorarioGuardado.usuario))
            .filter(HorarioGuardado.idHorarioGuardado == id_horario_guardado)
            .first()
        )

    @staticmethod
    def crear(db: Session, horario_guardado: HorarioGuardado):
        db.add(horario_guardado)
        db.commit()
        db.refresh(horario_guardado)
        return horario_guardado

    @staticmethod
    def eliminar(db: Session, horario_guardado: HorarioGuardado):
        db.delete(horario_guardado)
        db.commit()
