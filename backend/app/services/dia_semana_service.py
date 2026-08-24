from app.models.dia_semana import DiaSemana
from app.repositories.dia_semana_repository import DiaSemanaRepository


class DiaSemanaService:
    @staticmethod
    def obtener_todos(db):
        return DiaSemanaRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_dia):
        return DiaSemanaRepository.obtener_por_id(db, id_dia)

    @staticmethod
    def crear(db, data):
        nuevo_dia = DiaSemana(nombreDia=data.nombreDia)
        return DiaSemanaRepository.crear(db, nuevo_dia)

    @staticmethod
    def actualizar(db, id_dia, data):
        dia = DiaSemanaRepository.obtener_por_id(db, id_dia)

        if not dia:
            return None

        dia.nombreDia = data.nombreDia

        return DiaSemanaRepository.actualizar(db, dia)

    @staticmethod
    def eliminar(db, id_dia):
        dia = DiaSemanaRepository.obtener_por_id(db, id_dia)

        if not dia:
            return False

        DiaSemanaRepository.eliminar(db, dia)
        return True