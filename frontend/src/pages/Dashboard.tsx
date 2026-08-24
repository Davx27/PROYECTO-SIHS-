import { useEffect, useState } from 'react'
import senaLogo from '../assets/sena-logo.jpeg'
import { useAuth } from '../hooks/useAuth'
import { apiGet, ApiError } from '../services/api'
import type { Rol, Usuario } from '../types/api'

const NAV_DISPONIBLE = ['Dashboard']
const NAV_PENDIENTE = ['Horarios', 'Ambientes', 'Instructores', 'Fichas', 'Reportes']

/**
 * Único punto de la app (por ahora) que consume el backend más allá de
 * Supabase Auth. Todo lo que se ve acá viene de:
 *   - GET /usuarios/me        → cualquier usuario autenticado
 *   - GET /usuarios           → solo Administrador (403 para los demás)
 *   - GET /roles              → solo Administrador (403 para los demás)
 *
 * A propósito NO se inventan datos de "horarios activos" / "cruces
 * detectados" / "ambientes disponibles" como en el mockup original — esos
 * módulos no existen todavía en el backend (ver
 * backend/OBJETIVO_Y_SERVICIOS_FALTANTES.md). Cuando existan, agregar su
 * fetch acá siguiendo el mismo patrón que useEffect() de abajo.
 */
export function Dashboard() {
  const { signOut } = useAuth()

  const [miPerfil, setMiPerfil] = useState<Usuario | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[] | 'sin-permiso' | null>(null)
  const [roles, setRoles] = useState<Rol[] | 'sin-permiso' | null>(null)

  useEffect(() => {
    apiGet<Usuario>('/usuarios/me').then(setMiPerfil)

    apiGet<Usuario[]>('/usuarios').then(setUsuarios).catch((err: ApiError) => {
      if (err.status === 403) setUsuarios('sin-permiso')
    })

    apiGet<Rol[]>('/roles').then(setRoles).catch((err: ApiError) => {
      if (err.status === 403) setRoles('sin-permiso')
    })
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-5 sm:block">
        <div className="mb-8 flex items-center gap-2.5">
          <img src={senaLogo} alt="SENA" className="h-9 w-9 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-bold text-slate-900">SIHS</p>
            <p className="text-xs text-slate-500">CGMLTI</p>
          </div>
        </div>

        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400">GESTIÓN</p>
        <nav className="space-y-1">
          {NAV_DISPONIBLE.map((item) => (
            <span
              key={item}
              className="block rounded-lg bg-sena-50 px-3 py-2 text-sm font-medium text-sena-700"
            >
              {item}
            </span>
          ))}
          {NAV_PENDIENTE.map((item) => (
            <span
              key={item}
              title="Módulo aún no implementado en el backend"
              className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-400"
            >
              {item}
              <span className="text-[10px] uppercase">pronto</span>
            </span>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3">
          <input
            type="search"
            placeholder="Buscar ficha, instructor o ambiente…"
            disabled
            className="w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 placeholder:text-slate-400"
          />

          <div className="flex items-center gap-3">
            {miPerfil && (
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{miPerfil.nombre}</p>
                <p className="text-xs text-slate-500">{miPerfil.email}</p>
              </div>
            )}
            <button
              onClick={() => void signOut()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="p-6">
          <h1 className="mb-1 text-2xl font-bold text-slate-900">Panel de programación</h1>
          <p className="mb-6 text-sm text-slate-500">
            Centro de Gestión de Mercados, Logística y TI
          </p>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Tarjeta titulo="Mi perfil (GET /usuarios/me)">
              {miPerfil ? (
                <>
                  <p className="text-lg font-semibold text-slate-900">{miPerfil.nombre}</p>
                  <p className="text-sm text-slate-500">{miPerfil.email}</p>
                  <p className="mt-1 text-xs text-slate-400">Estado: {miPerfil.estado}</p>
                </>
              ) : (
                <p className="text-sm text-slate-400">Cargando…</p>
              )}
            </Tarjeta>

            <Tarjeta titulo="Usuarios registrados (GET /usuarios)">
              <EstadoAdmin dato={usuarios} render={(lista) => (
                <p className="text-3xl font-bold text-slate-900">{lista.length}</p>
              )} />
            </Tarjeta>

            <Tarjeta titulo="Roles del sistema (GET /roles)">
              <EstadoAdmin dato={roles} render={(lista) => (
                <ul className="space-y-0.5 text-sm text-slate-700">
                  {lista.map((rol) => (
                    <li key={rol.idRol}>{rol.nombre}</li>
                  ))}
                </ul>
              )} />
            </Tarjeta>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
            <p className="font-semibold text-slate-700">
              Horarios, ambientes, instructores y fichas todavía no tienen módulo en el backend.
            </p>
            <p className="mt-1">
              Ver <code className="rounded bg-slate-100 px-1.5 py-0.5">
                backend/OBJETIVO_Y_SERVICIOS_FALTANTES.md
              </code>{' '}
              para el orden recomendado de implementación — cuando exista el endpoint, esta
              pantalla es el lugar donde se conecta siguiendo el mismo patrón de{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">apiGet</code> de arriba.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

function Tarjeta({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="mb-3 text-xs font-medium tracking-wide text-slate-400 uppercase">{titulo}</p>
      {children}
    </div>
  )
}

function EstadoAdmin<T>({
  dato,
  render,
}: {
  dato: T[] | 'sin-permiso' | null
  render: (lista: T[]) => React.ReactNode
}) {
  if (dato === null) return <p className="text-sm text-slate-400">Cargando…</p>
  if (dato === 'sin-permiso') {
    return <p className="text-sm text-amber-600">Requiere rol Administrador</p>
  }
  return <>{render(dato)}</>
}
