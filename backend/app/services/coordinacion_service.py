from app.models.coordinacion import Coordinacion
from app.repositories.coordinacion_repository import CoordinacionRepository


class CoordinacionService:
    @staticmethod
    def obtener_todos(db):
        return CoordinacionRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_coordinacion):
        return CoordinacionRepository.obtener_por_id(db, id_coordinacion)

    @staticmethod
    def crear(db, data):
        nueva_coordinacion = Coordinacion(nombreCoordinacion=data.nombreCoordinacion)
        return CoordinacionRepository.crear(db, nueva_coordinacion)

    @staticmethod
    def actualizar(db, id_coordinacion, data):
        coordinacion = CoordinacionRepository.obtener_por_id(db, id_coordinacion)

        if not coordinacion:
            return None

        coordinacion.nombreCoordinacion = data.nombreCoordinacion

        return CoordinacionRepository.actualizar(db, coordinacion)

    @staticmethod
    def eliminar(db, id_coordinacion):
        coordinacion = CoordinacionRepository.obtener_por_id(db, id_coordinacion)

        if not coordinacion:
            return False

        CoordinacionRepository.eliminar(db, coordinacion)
        return True
