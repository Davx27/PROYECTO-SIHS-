from app.models.competencia_formacion import CompetenciaFormacion
from app.repositories.competencia_formacion_repository import CompetenciaFormacionRepository


class CompetenciaFormacionService:
    @staticmethod
    def obtener_todos(db):
        return CompetenciaFormacionRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_competencia):
        return CompetenciaFormacionRepository.obtener_por_id(db, id_competencia)

    @staticmethod
    def crear(db, data):
        nueva_competencia = CompetenciaFormacion(
            codigo=data.codigo,
            descripcion=data.descripcion,
            idPrograma=data.idPrograma,
        )
        return CompetenciaFormacionRepository.crear(db, nueva_competencia)

    @staticmethod
    def actualizar(db, id_competencia, data):
        competencia = CompetenciaFormacionRepository.obtener_por_id(db, id_competencia)

        if not competencia:
            return None

        competencia.codigo = data.codigo
        competencia.descripcion = data.descripcion
        competencia.idPrograma = data.idPrograma

        return CompetenciaFormacionRepository.actualizar(db, competencia)

    @staticmethod
    def eliminar(db, id_competencia):
        competencia = CompetenciaFormacionRepository.obtener_por_id(db, id_competencia)

        if not competencia:
            return False

        CompetenciaFormacionRepository.eliminar(db, competencia)
        return True
