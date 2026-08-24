// Espejo de los schemas Pydantic del backend (backend/app/schemas/*.py).
// Si un schema cambia allá, este archivo hay que actualizarlo a mano — no
// hay generación automática todavía.

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
