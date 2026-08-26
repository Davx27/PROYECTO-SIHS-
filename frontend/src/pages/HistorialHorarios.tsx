import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { ExportarPdfButton } from '../components/ExportarPdfButton'
import { GridHorario } from '../components/horario/GridHorario'
import { apiGet, ApiError } from '../services/api'
import type { HorarioGuardado } from '../types/api'

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/**
 * Lista de horarios guardados desde `NuevoHorario.tsx` (tabla
 * `horarios_guardados`, ver ese archivo para por qué no es el módulo
 * `horarios` real todavía) — clic en uno para verlo completo en modo
 * solo lectura y, desde ahí, exportarlo a PDF con el mismo
 * `ExportarPdfButton` reutilizable que usa el editor.
 */
export function HistorialHorarios() {
  const [horarios, setHorarios] = useState<HorarioGuardado[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null)

  useEffect(() => {
    apiGet<HorarioGuardado[]>('/horarios-guardados')
      .then(setHorarios)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : 'No se pudo cargar el historial de horarios.'),
      )
  }, [])

  const seleccionado = horarios?.find((h) => h.idHorarioGuardado === seleccionadoId) ?? null

  return (
    <AppShell activo="Historial de horarios">
      <div className="mb-6 print:hidden">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Historial de horarios</h1>
        <p className="text-sm text-slate-500">
          Horarios guardados desde el editor — clic en uno para verlo completo y exportarlo.
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 print:hidden">
          {error}
        </p>
      )}

      {!horarios && !error && <p className="text-sm text-slate-500 print:hidden">Cargando…</p>}

      {horarios && horarios.length === 0 && (
        <p className="text-sm text-slate-500 print:hidden">
          Todavía no se ha guardado ningún horario — créalo desde "Horarios" en el menú.
        </p>
      )}

      {horarios && horarios.length > 0 && !seleccionado && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white print:hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Ficha</th>
                <th className="px-4 py-3">Creado por</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {horarios.map((h) => (
                <tr key={h.idHorarioGuardado} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{h.ficha}</td>
                  <td className="px-4 py-3 text-slate-600">{h.creadorNombre ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatearFecha(h.fechaCreacion)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSeleccionadoId(h.idHorarioGuardado)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Ver horario
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {seleccionado && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <button
              type="button"
              onClick={() => setSeleccionadoId(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              ← Volver al historial
            </button>
            <ExportarPdfButton />
          </div>

          <div className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-4">
            <Campo etiqueta="Ficha">{seleccionado.ficha}</Campo>
            <Campo etiqueta="Aprendices en formación">{seleccionado.aprendices ?? '—'}</Campo>
            <Campo etiqueta="Horas asignadas trimestre">{seleccionado.horasTrimestre ?? '—'}</Campo>
            <Campo etiqueta="Inicio / fin de trimestre">
              {seleccionado.fechaInicio ?? '—'} – {seleccionado.fechaFin ?? '—'}
            </Campo>
          </div>

          <div className="min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white p-5">
            <GridHorario
              bloques={seleccionado.bloques}
              grid={seleccionado.grid}
              hayBloqueActivo={false}
              soloLectura
            />
          </div>
        </div>
      )}
    </AppShell>
  )
}

function Campo({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div>
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">{etiqueta}</span>
      <p className="text-sm text-slate-900">{children}</p>
    </div>
  )
}
