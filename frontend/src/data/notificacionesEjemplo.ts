export type TipoNotificacion = 'cruce' | 'horario' | 'ambiente' | 'sistema'
export type GrupoNotificacion = 'Hoy' | 'Ayer' | 'Esta semana'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  titulo: string
  descripcion: string
  grupo: GrupoNotificacion
  hora: string
  leida: boolean
}

// El módulo de notificaciones real (triggers, persistencia, WebSocket/polling)
// todavía no existe en el backend — esto es solo el dato de ejemplo para la
// tarjeta flotante (ver NotificacionesPanel.tsx), reflejando eventos que ya
// generan las demás pantallas (cruces de horario del Dashboard, CRUD de
// sedes/ambientes). Reemplazar por un fetch real (GET /notificaciones)
// siguiendo el patrón de apiGet en cuanto el endpoint exista.
export const NOTIFICACIONES: Notificacion[] = [
  {
    id: 'n1',
    tipo: 'cruce',
    titulo: 'Cruce de instructor detectado',
    descripcion: 'Óscar Bermúdez queda asignado a dos sesiones simultáneas a las 10:00 (fichas 2744019 y 2758431, Lab 204).',
    grupo: 'Hoy',
    hora: '09:42',
    leida: false,
  },
  {
    id: 'n2',
    tipo: 'ambiente',
    titulo: 'Ambiente sin confirmar',
    descripcion: 'Lab 301 sigue en estado "Por confirmar" para la sesión de las 15:00 de la ficha 2712880.',
    grupo: 'Hoy',
    hora: '08:15',
    leida: false,
  },
  {
    id: 'n3',
    tipo: 'horario',
    titulo: 'Horario publicado',
    descripcion: 'Se confirmó el horario de la ficha 2803577 (Gestión de Mercados) para el trimestre 3 · 2026.',
    grupo: 'Hoy',
    hora: '07:30',
    leida: true,
  },
  {
    id: 'n4',
    tipo: 'sistema',
    titulo: 'Plazo de programación',
    descripcion: 'La ventana para editar horarios del trimestre 3 · 2026 cierra el 12 de septiembre.',
    grupo: 'Ayer',
    hora: '16:05',
    leida: true,
  },
  {
    id: 'n5',
    tipo: 'cruce',
    titulo: 'Cruce de ambiente detectado',
    descripcion: 'Lab 204 tiene dos fichas asignadas al mismo bloque de las 10:00.',
    grupo: 'Esta semana',
    hora: 'Lunes · 14:10',
    leida: true,
  },
]
