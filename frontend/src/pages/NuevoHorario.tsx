import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ExportarPdfButton } from '../components/ExportarPdfButton'
import { HorarioEditor } from '../components/horario/HorarioEditor'
import { apiPost, ApiError } from '../services/api'
import { BLOQUES, DIAS } from './horario/tipos'
import type { BloqueClase, GridAsignaciones } from './horario/tipos'

const FICHA_EJEMPLO = '3_TRM_3228973B_(M)_ANALISIS Y DESARROLLO DE SOFTWARE.'

/**
 * Datos de ejemplo tomados de la plantilla institucional real
 * (_Docs/Diseño/plantillas-institucionales/disponibilidad-ficha-3228973B.pdf)
 * — ficha 3228973 B, trimestre 3 de 2026. Son solo el punto de partida: cada
 * bloque de clase es editable y reutilizable (ver "Bloques de clase" en
 * `HorarioEditor`). "Guardar horario" persiste esto en `horarios_guardados`
 * (ver `backend/app/api/v1/horarios_guardados.py`) — es una tabla puente en
 * JSONB, NO el módulo `horarios` relacional real (con detección de cruces)
 * que sigue sin existir en el backend; ver
 * `_Docs/Documentación general/SECCION_ESTUDIANTES.md` para el porqué.
 */
function datosIniciales(): { bloques: BloqueClase[]; grid: GridAsignaciones } {
  const bloques: BloqueClase[] = [
    { id: 'seed-comunicacion', tematica: 'Comunicación', instructor: 'Claudia Pinzón', ficha: FICHA_EJEMPLO, ambiente: '607_Torre 1_Unigermana' },
    { id: 'seed-investigacion', tematica: 'Investigación', instructor: 'Claudia Pinzón', ficha: FICHA_EJEMPLO, ambiente: '607_Torre 1_Unigermana' },
    { id: 'seed-593103', tematica: '593103 - 01 Elaborar los artefactos de diseño del software siguiendo las prácticas de la metodología seleccionada.', instructor: 'Sergio Garzón', ficha: FICHA_EJEMPLO, ambiente: '412 Av.Caracas_con_52' },
    { id: 'seed-592375', tematica: '592375 - 01 Planear actividades de análisis de acuerdo con la metodología seleccionada.', instructor: 'Erick Granados', ficha: FICHA_EJEMPLO, ambiente: '412 Av.Caracas_con_52' },
    { id: 'seed-593107', tematica: '593107 - 02 Construir la base de datos para el software a partir del modelo de datos.', instructor: 'Fredy Ardila', ficha: FICHA_EJEMPLO, ambiente: '412 Av.Caracas_con_52' },
    { id: 'seed-593102', tematica: '593102 - 04 Verificar los entregables de la fase de diseño del software de acuerdo con lo establecido en el informe de análisis.', instructor: 'Erick Granados', ficha: FICHA_EJEMPLO, ambiente: '211 Av.Caracas_con_52' },
    { id: 'seed-sst', tematica: 'Medio Ambiente y SST', instructor: 'Vanessa Gualaco', ficha: FICHA_EJEMPLO, ambiente: '601_Torre 1_Unigermana' },
  ]

  const grid: GridAsignaciones = BLOQUES.map(() => DIAS.map(() => null))

  // Bloque horario 0 = Mañana 6:15-9:00, día 4 = Viernes
  grid[0][4] = 'seed-comunicacion'
  // Bloque horario 1 = Mañana 9:00-12:00, día 4 = Viernes
  grid[1][4] = 'seed-investigacion'

  // Bloques horario 4 y 5 = Noche (6-8pm y 8-10pm), días 0-4 = Lunes a Viernes,
  // mismo bloque de clase en ambos tramos porque la jornada nocturna dicta un
  // solo tema en sesión de 4 horas.
  const nocheLunesAViernes = ['seed-593103', 'seed-592375', 'seed-593107', 'seed-593102', 'seed-sst']
  nocheLunesAViernes.forEach((bloqueId, diaIdx) => {
    grid[4][diaIdx] = bloqueId
    grid[5][diaIdx] = bloqueId
  })

  return { bloques, grid }
}

const SEDES = [
  { nombre: 'Sede principal', direccion: 'Calle 52 # 13 -65' },
  { nombre: 'Sede Unigermana', direccion: 'AK 14 # 63 – 87' },
  { nombre: 'Sede Fontibón', direccion: 'Cl 19A # 96c - 40' },
]

export function NuevoHorario() {
  const navigate = useNavigate()
  const [ficha, setFicha] = useState('3228973 B')
  const [aprendices, setAprendices] = useState('0')
  const [horasTrimestre, setHorasTrimestre] = useState('36')
  const [fechaInicio, setFechaInicio] = useState('2026-01-29')
  const [fechaFin, setFechaFin] = useState('2026-04-14')
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null)

  // Solo se usa para inicializar HorarioEditor una vez — el estado real del
  // grid vive dentro de HorarioEditor/useHorarioState. `estadoActualRef` lo
  // recibe en vivo vía `onCambiarEstado` para poder leerlo al guardar sin
  // provocar un re-render en cada clic dentro del editor.
  const [{ bloques, grid }] = useState(datosIniciales)
  const estadoActualRef = useRef<{ bloques: BloqueClase[]; grid: GridAsignaciones }>({ bloques, grid })
  const capturarEstadoActual = useCallback((estado: { bloques: BloqueClase[]; grid: GridAsignaciones }) => {
    estadoActualRef.current = estado
  }, [])

  async function guardarHorario() {
    setGuardando(true)
    setErrorGuardar(null)
    try {
      await apiPost('/horarios-guardados', {
        ficha,
        aprendices,
        horasTrimestre,
        fechaInicio,
        fechaFin,
        bloques: estadoActualRef.current.bloques,
        grid: estadoActualRef.current.grid,
      })
      navigate('/horarios/historial')
    } catch (err) {
      setErrorGuardar(err instanceof ApiError ? err.message : 'No se pudo guardar el horario.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <AppShell activo="Horarios">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-slate-900">Nuevo horario</h1>
          <p className="text-sm text-slate-500">
            Define un bloque de clase una sola vez y reutilízalo en el grid — no hace falta
            volver a escribir instructor/ficha/ambiente en cada celda.
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <Link
            to="/dashboard"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <ExportarPdfButton etiqueta="Exportar a PDF" />
          <button
            type="button"
            onClick={() => void guardarHorario()}
            disabled={guardando}
            className="rounded-lg bg-sena-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sena-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? 'Guardando…' : 'Guardar horario'}
          </button>
        </div>
      </div>

      {errorGuardar && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 print:hidden">
          {errorGuardar}
        </p>
      )}

      <div className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-4">
        <Campo etiqueta="Ficha">
          <input
            value={ficha}
            onChange={(e) => setFicha(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
          />
        </Campo>
        <Campo etiqueta="Aprendices en formación a la fecha">
          <input
            value={aprendices}
            onChange={(e) => setAprendices(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
          />
        </Campo>
        <Campo etiqueta="Horas asignadas trimestre">
          <input
            value={horasTrimestre}
            onChange={(e) => setHorasTrimestre(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
          />
        </Campo>
        <Campo etiqueta="Inicio / fin de trimestre">
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-900"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-900"
            />
          </div>
        </Campo>
      </div>

      <div className="mb-6">
        <HorarioEditor bloquesIniciales={bloques} gridInicial={grid} onCambiarEstado={capturarEstadoActual} />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="mb-2 font-semibold text-slate-900">Dirección sede principal y sedes</p>
        <ul className="space-y-0.5">
          {SEDES.map((sede) => (
            <li key={sede.nombre}>
              <span className="font-medium text-slate-700">{sede.nombre}:</span> {sede.direccion}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-400 print:hidden">
          Plantilla base:{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">
            _Docs/Diseño/plantillas-institucionales/disponibilidad-ficha-3228973B.pdf
          </code>
          . Reglas de color/tipografía en{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">_Docs/Diseño/GUIA_DE_MARCA.md</code>.
        </p>
      </div>
    </AppShell>
  )
}

function Campo({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {etiqueta}
      </span>
      {children}
    </label>
  )
}
