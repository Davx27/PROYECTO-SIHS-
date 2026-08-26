from app.models.trimestre import Trimestre
from app.repositories.trimestre_repository import TrimestreRepository


class TrimestreService:
    @staticmethod
    def obtener_todos(db):
        return TrimestreRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_trimestre):
        return TrimestreRepository.obtener_por_id(db, id_trimestre)

    @staticmethod
    def crear(db, data):
        nuevo_trimestre = Trimestre(
            nombre=data.nombre,
            fechaInicio=data.fechaInicio,
            fechaFin=data.fechaFin,
            estado=data.estado,
        )
        return TrimestreRepository.crear(db, nuevo_trimestre)

    @staticmethod
    def actualizar(db, id_trimestre, data):
        trimestre = TrimestreRepository.obtener_por_id(db, id_trimestre)

        if not trimestre:
            return None

        trimestre.nombre = data.nombre
        trimestre.fechaInicio = data.fechaInicio
        trimestre.fechaFin = data.fechaFin
        trimestre.estado = data.estado

        return TrimestreRepository.actualizar(db, trimestre)

    @staticmethod
    def eliminar(db, id_trimestre):
        trimestre = TrimestreRepository.obtener_por_id(db, id_trimestre)

        if not trimestre:
            return False

        TrimestreRepository.eliminar(db, trimestre)
        return True
