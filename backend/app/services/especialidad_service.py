from app.models.especialidad import Especialidad
from app.repositories.especialidad_repository import EspecialidadRepository


class EspecialidadService:
    @staticmethod
    def obtener_todos(db):
        return EspecialidadRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_especialidad):
        return EspecialidadRepository.obtener_por_id(db, id_especialidad)

    @staticmethod
    def crear(db, data):
        nueva_especialidad = Especialidad(
            nombre=data.nombre,
            descripcion=data.descripcion,
            activo=data.activo,
        )
        return EspecialidadRepository.crear(db, nueva_especialidad)

    @staticmethod
    def actualizar(db, id_especialidad, data):
        especialidad = EspecialidadRepository.obtener_por_id(db, id_especialidad)

        if not especialidad:
            return None

        especialidad.nombre = data.nombre
        especialidad.descripcion = data.descripcion
        especialidad.activo = data.activo

        return EspecialidadRepository.actualizar(db, especialidad)

    @staticmethod
    def eliminar(db, id_especialidad):
        especialidad = EspecialidadRepository.obtener_por_id(db, id_especialidad)

        if not especialidad:
            return False

        EspecialidadRepository.eliminar(db, especialidad)
        return True