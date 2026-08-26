export type Jornada = 'Mañana' | 'Tarde' | 'Noche'

export interface BloqueHorario {
  jornada: Jornada
  horaInicio: string
  horaFin: string
}

/** Un bloque de clase reutilizable: se define una vez y se asigna a varias celdas del grid. */
export interface BloqueClase {
  id: string
  tematica: string
  instructor: string
  ficha: string
  ambiente: string
}

/** Coordenada de una celda del grid: índice de bloque horario + índice de día. */
export interface PosicionCelda {
  bloqueIdx: number
  diaIdx: number
}

/** Grid de asignaciones: para cada celda, el id de `BloqueClase` asignado (si hay). */
export type GridAsignaciones = (string | null)[][]

export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const

// Dos bloques por jornada, con su "Receso" entre ambos — igual que la
// plantilla institucional (ver PDF referenciado en NuevoHorario.tsx).
export const BLOQUES: BloqueHorario[] = [
  { jornada: 'Mañana', horaInicio: '6:15 a.m', horaFin: '9:00 a.m' },
  { jornada: 'Mañana', horaInicio: '9:00 a.m', horaFin: '12:00 p.m' },
  { jornada: 'Tarde', horaInicio: '12:00 p.m', horaFin: '3:00 p.m' },
  { jornada: 'Tarde', horaInicio: '3:00 p.m', horaFin: '6:00 p.m' },
  { jornada: 'Noche', horaInicio: '6:00 p.m', horaFin: '8:00 p.m' },
  { jornada: 'Noche', horaInicio: '8:00 p.m', horaFin: '10:00 p.m' },
]
