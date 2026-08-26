from app.models.programa import Programa
from app.repositories.programa_repository import ProgramaRepository


class ProgramaService:
    @staticmethod
    def obtener_todos(db):
        return ProgramaRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_programa):
        return ProgramaRepository.obtener_por_id(db, id_programa)

    @staticmethod
    def crear(db, data):
        nuevo_programa = Programa(
            codigoPrograma=data.codigoPrograma,
            nombrePrograma=data.nombrePrograma,
            nivelFormacion=data.nivelFormacion,
            activo=data.activo,
            idCoordinacion=data.idCoordinacion,
        )
        return ProgramaRepository.crear(db, nuevo_programa)

    @staticmethod
    def actualizar(db, id_programa, data):
        programa = ProgramaRepository.obtener_por_id(db, id_programa)

        if not programa:
            return None

        programa.codigoPrograma = data.codigoPrograma
        programa.nombrePrograma = data.nombrePrograma
        programa.nivelFormacion = data.nivelFormacion
        programa.activo = data.activo
        programa.idCoordinacion = data.idCoordinacion

        return ProgramaRepository.actualizar(db, programa)

    @staticmethod
    def eliminar(db, id_programa):
        programa = ProgramaRepository.obtener_por_id(db, id_programa)

        if not programa:
            return False

        ProgramaRepository.eliminar(db, programa)
        return True
