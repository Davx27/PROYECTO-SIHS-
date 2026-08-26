from app.models.guia import Guia
from app.repositories.guia_repository import GuiaRepository


class GuiaService:
    @staticmethod
    def obtener_todos(db):
        return GuiaRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_guia):
        return GuiaRepository.obtener_por_id(db, id_guia)

    @staticmethod
    def crear(db, data):
        nueva_guia = Guia(
            codigo=data.codigo,
            idPrograma=data.idPrograma,
            idTrimestre=data.idTrimestre,
        )
        return GuiaRepository.crear(db, nueva_guia)

    @staticmethod
    def actualizar(db, id_guia, data):
        guia = GuiaRepository.obtener_por_id(db, id_guia)

        if not guia:
            return None

        guia.codigo = data.codigo
        guia.idPrograma = data.idPrograma
        guia.idTrimestre = data.idTrimestre

        return GuiaRepository.actualizar(db, guia)

    @staticmethod
    def eliminar(db, id_guia):
        guia = GuiaRepository.obtener_por_id(db, id_guia)

        if not guia:
            return False

        GuiaRepository.eliminar(db, guia)
        return True
