from app.models.horario import Horario
from app.repositories.horario_repository import HorarioRepository


class CruceHorarioError(Exception):
    """Se lanza cuando crear/actualizar un horario produciría un cruce.
    La capa de API (`api/v1/horarios.py`) la traduce a un 409 con la lista
    de mensajes — ver
    _Docs/Documentación general/PLAN_INTEGRACION_LOGICA_Y_BD.md §3."""

    def __init__(self, mensajes: list[str]):
        self.mensajes = mensajes
        super().__init__("; ".join(mensajes))


class HorarioService:
    @staticmethod
    def obtener_todos(db):
        return HorarioRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_horario):
        return HorarioRepository.obtener_por_id(db, id_horario)

    @staticmethod
    def crear(db, data):
        errores = HorarioService._detectar_cruces(db, data)
        if errores:
            raise CruceHorarioError(errores)

        nuevo_horario = Horario(
            horaInicio=data.horaInicio,
            horaFin=data.horaFin,
            idJornada=data.idJornada,
            idTrimestre=data.idTrimestre,
            idAmbiente=data.idAmbiente,
            idInstructor=data.idInstructor,
            idFicha=data.idFicha,
            idResultado=data.idResultado,
        )
        return HorarioRepository.crear(db, nuevo_horario, data.dias)

    @staticmethod
    def actualizar(db, id_horario, data):
        horario = HorarioRepository.obtener_por_id(db, id_horario)

        if not horario:
            return None

        errores = HorarioService._detectar_cruces(db, data, excluir_id=id_horario)
        if errores:
            raise CruceHorarioError(errores)

        horario.horaInicio = data.horaInicio
        horario.horaFin = data.horaFin
        horario.idJornada = data.idJornada
        horario.idTrimestre = data.idTrimestre
        horario.idAmbiente = data.idAmbiente
        horario.idInstructor = data.idInstructor
        horario.idFicha = data.idFicha
        horario.idResultado = data.idResultado

        return HorarioRepository.actualizar(db, horario, data.dias)

    @staticmethod
    def eliminar(db, id_horario):
        horario = HorarioRepository.obtener_por_id(db, id_horario)

        if not horario:
            return False

        HorarioRepository.eliminar(db, horario)
        return True

    @staticmethod
    def _detectar_cruces(db, data, excluir_id: int | None = None) -> list[str]:
        """Los 4 tipos de cruce confirmados entre las dos entrevistas a
        coordinadores (Teleinformática y Logística) — ver
        REGLAS_DE_NEGOCIO_CONOCIDAS.md. Se chequean del más barato al más
        caro: existencia primero, solapes de horas después."""
        errores: list[str] = []

        if HorarioRepository.existe_resultado_en_ficha(db, data.idFicha, data.idResultado, excluir_id):
            errores.append("Ese resultado de aprendizaje ya está programado para esta ficha.")

        if HorarioRepository.existe_solape(
            db, "idFicha", data.idFicha, data.dias, data.horaInicio, data.horaFin, excluir_id
        ):
            errores.append("La ficha ya tiene otra clase programada en ese horario.")

        if HorarioRepository.existe_solape(
            db, "idInstructor", data.idInstructor, data.dias, data.horaInicio, data.horaFin, excluir_id
        ):
            errores.append("El instructor ya tiene otra clase programada en ese horario.")

        if HorarioRepository.existe_solape(
            db, "idAmbiente", data.idAmbiente, data.dias, data.horaInicio, data.horaFin, excluir_id
        ):
            errores.append("El ambiente ya está ocupado en ese horario.")

        return errores
