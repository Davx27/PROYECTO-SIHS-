from app.models.horario import Horario
from app.models.dia_semana import DiaSemana
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
    def obtener_por_instructor(db, id_instructor):
        return HorarioRepository.obtener_por_instructor(db, id_instructor)

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
        """Cruces por solape de horario: misma ficha, mismo instructor o
        mismo ambiente ya ocupados en ese día/hora — ver
        REGLAS_DE_NEGOCIO_CONOCIDAS.md. (Antes existía un cuarto chequeo que
        bloqueaba repetir un resultado en la misma ficha sin importar el
        horario; se quitó porque un resultado normalmente se dicta en
        varios bloques — antes/después del descanso, distintos días — no
        una sola vez.) Cada mensaje dice CONTRA QUÉ horario existente choca
        (día, hora, y quién/qué ya lo tiene) — no solo la regla que se
        violó, para que se entienda de un vistazo sin tener que ir a
        buscarlo a mano."""
        errores: list[str] = []

        ficha_existente = HorarioRepository.buscar_solape(
            db, "idFicha", data.idFicha, data.dias, data.horaInicio, data.horaFin, excluir_id
        )
        if ficha_existente:
            errores.append(
                "La ficha ya tiene otra clase programada en ese horario: "
                f"{HorarioService._describir(db, ficha_existente)}."
            )

        instructor_existente = HorarioRepository.buscar_solape(
            db, "idInstructor", data.idInstructor, data.dias, data.horaInicio, data.horaFin, excluir_id
        )
        if instructor_existente:
            errores.append(
                "El instructor ya tiene otra clase programada en ese horario: "
                f"{HorarioService._describir(db, instructor_existente)}."
            )

        ambiente_existente = HorarioRepository.buscar_solape(
            db, "idAmbiente", data.idAmbiente, data.dias, data.horaInicio, data.horaFin, excluir_id
        )
        if ambiente_existente:
            errores.append(
                "El ambiente ya está ocupado en ese horario: "
                f"{HorarioService._describir(db, ambiente_existente)}."
            )

        return errores

    @staticmethod
    def _describir(db, horario: Horario) -> str:
        """'Lunes y Miércoles 07:00-09:00 · Carlos Lopez · ficha 2874521 ·
        Ambiente 1' — arma la descripción legible de un horario existente,
        para explicar un cruce con detalle en vez de solo nombrar la regla."""
        ids_dias = HorarioRepository.obtener_dias(db, horario.idHorario)
        dias = db.query(DiaSemana).filter(DiaSemana.idDia.in_(ids_dias)).order_by(DiaSemana.idDia).all()
        nombres_dias = " y ".join(d.nombreDia for d in dias) if dias else "días sin especificar"

        instructor = horario.instructor.nombre if horario.instructor else "instructor desconocido"
        ficha = horario.ficha.codigoFicha if horario.ficha else "ficha desconocida"
        ambiente = horario.ambiente.nombre if horario.ambiente else "ambiente desconocido"

        return (
            f"{nombres_dias} {horario.horaInicio.strftime('%H:%M')}-{horario.horaFin.strftime('%H:%M')}, "
            f"instructor {instructor}, ficha {ficha}, {ambiente}"
        )
