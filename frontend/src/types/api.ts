// Espejo de los schemas Pydantic del backend (backend/app/schemas/*.py).
// Si un schema cambia allá, este archivo hay que actualizarlo a mano — no
// hay generación automática todavía.

import type { BloqueClase, GridAsignaciones } from '../pages/horario/tipos'

export interface Usuario {
  idUsuario: string
  nombre: string
  email: string
  estado: 'activo' | 'inactivo'
  fechaRegistro: string
}

export interface Rol {
  idRol: number
  nombre: string
}

export interface Jornada {
  idJornada: number
  nombreJornada: string
}

export interface DiaSemana {
  idDia: number
  nombreDia: string
}

// Espejo de HorarioGuardadoResponse (backend/app/schemas/horario_guardado.py).
// "Guardado" a propósito, no "Horario": esto es lo que arma el editor
// (frontend/src/pages/NuevoHorario.tsx) con ficha/instructor/ambiente como
// texto libre — no la tabla relacional `horarios` real (con FKs y
// detección de cruces), que todavía no existe en el backend. Ver
// `_Docs/Documentación general/SECCION_ESTUDIANTES.md`.
export interface HorarioGuardado {
  idHorarioGuardado: number
  idUsuario: string
  creadorNombre: string | null
  ficha: string
  aprendices: string | null
  horasTrimestre: string | null
  fechaInicio: string | null
  fechaFin: string | null
  bloques: BloqueClase[]
  grid: GridAsignaciones
  fechaCreacion: string
}
