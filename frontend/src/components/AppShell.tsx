import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import senaLogo from '../assets/sena-logo.jpeg'
import { useAuth } from '../hooks/useAuth'
import { apiGet } from '../services/api'
import type { Usuario } from '../types/api'

interface ItemNav {
  etiqueta: string
  ruta?: string
}

const NAV: ItemNav[] = [
  { etiqueta: 'Inicio', ruta: '/dashboard' },
  { etiqueta: 'Horarios', ruta: '/horarios/nuevo' },
  { etiqueta: 'Ambientes' },
  { etiqueta: 'Instructores' },
  { etiqueta: 'Fichas' },
  { etiqueta: 'Reportes' },
]

function letraInicial(nombre: string) {
  return nombre.trim().charAt(0).toUpperCase()
}

interface AppShellProps {
  /** Etiqueta del ítem de NAV que debe verse activo (debe matchear `etiqueta` arriba). */
  activo: string
  children: ReactNode
}

/**
 * Sidebar + header institucional, compartido por Dashboard.tsx y cualquier
 * pantalla nueva bajo /dashboard. Réplica de
 * _Docs/Diseño/mockups-institucionales/03-dashboard.png — ver
 * _Docs/Diseño/GUIA_DE_MARCA.md para las reglas de color/tipografía que
 * sigue este componente.
 *
 * Los ítems de NAV sin `ruta` son módulos que todavía no existen en el
 * backend (ver backend/OBJETIVO_Y_SERVICIOS_FALTANTES.md) — se muestran
 * deshabilitados. Cuando un módulo nuevo tenga pantalla, agregarle `ruta`
 * acá y aparece habilitado automáticamente.
 */
export function AppShell({ activo, children }: AppShellProps) {
  const { signOut } = useAuth()
  const [miPerfil, setMiPerfil] = useState<Usuario | null>(null)

  useEffect(() => {
    apiGet<Usuario>('/usuarios/me')
      .then(setMiPerfil)
      .catch((err) => console.error('No se pudo cargar /usuarios/me:', err))
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-5 sm:flex">
        <div>
          <div className="mb-8 flex items-center gap-2.5">
            <img src={senaLogo} alt="SENA" className="h-9 w-9 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-bold text-slate-900">SIHS</p>
              <p className="text-xs text-slate-500">CGMLTI</p>
            </div>
          </div>

          <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400">GESTIÓN</p>
          <nav className="space-y-1">
            {NAV.map((item) => {
              const esActivo = item.etiqueta === activo

              if (item.ruta) {
                return (
                  <Link
                    key={item.etiqueta}
                    to={item.ruta}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      esActivo
                        ? 'bg-sena-50 text-sena-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`h-3.5 w-3.5 shrink-0 rounded ${
                        esActivo ? 'bg-sena-600' : 'border border-slate-300'
                      }`}
                    />
                    {item.etiqueta}
                  </Link>
                )
              }

              return (
                <span
                  key={item.etiqueta}
                  title="Módulo aún no implementado en el backend"
                  className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-400"
                >
                  <span className="h-3.5 w-3.5 shrink-0 rounded border border-slate-300" />
                  {item.etiqueta}
                </span>
              )
            })}
          </nav>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Trimestre 3 · 2026</p>
          <p className="mt-1 text-xs text-slate-500">Programación abierta hasta el 12 de septiembre.</p>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3">
          <div className="relative w-full max-w-sm">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="m20 20-3-3" />
            </svg>
            <input
              type="search"
              placeholder="Buscar ficha, instructor o ambiente…"
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3.5 text-sm text-slate-400 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
              Trimestre 3 · 2026
            </span>

            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500" />
            </span>

            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sena-600 text-xs font-semibold text-white">
                {miPerfil ? letraInicial(miPerfil.nombre) : '·'}
              </span>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {miPerfil ? miPerfil.nombre : 'Cargando…'}
                </p>
                <p className="text-xs text-slate-500">{miPerfil?.email ?? ''}</p>
              </div>
            </div>

            <button
              onClick={() => void signOut()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
