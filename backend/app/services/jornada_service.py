from app.models.jornada import Jornada
from app.repositories.jornada_repository import JornadaRepository


class JornadaService:
    @staticmethod
    def obtener_todos(db):
        return JornadaRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_jornada):
        return JornadaRepository.obtener_por_id(db, id_jornada)

    @staticmethod
    def crear(db, data):
        nueva_jornada = Jornada(nombreJornada=data.nombreJornada)
        return JornadaRepository.crear(db, nueva_jornada)

    @staticmethod
    def actualizar(db, id_jornada, data):
        jornada = JornadaRepository.obtener_por_id(db, id_jornada)

        if not jornada:
            return None

        jornada.nombreJornada = data.nombreJornada

        return JornadaRepository.actualizar(db, jornada)

    @staticmethod
    def eliminar(db, id_jornada):
        jornada = JornadaRepository.obtener_por_id(db, id_jornada)

        if not jornada:
            return False

        JornadaRepository.eliminar(db, jornada)
        return True