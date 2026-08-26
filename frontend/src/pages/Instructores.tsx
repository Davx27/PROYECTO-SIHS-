import { AppShell } from '../components/AppShell'

interface FilaInstructor {
  nombre: string
  sigla: string
  especialidad: string
  jornada: string
}

/**
 * Datos de ejemplo, con los mismos nombres/temáticas usados en el grid de
 * `NuevoHorario.tsx` (para que el demo se vea consistente en toda la app).
 * La sigla es un ejemplo del patrón que describió el coordinador en la
 * entrevista ("este instructor, allá lo conocen como UA") — no son códigos
 * reales. Backend: `especialidades`/`usuario_especialidad` ya existen
 * (`backend/app/api/v1/especialidades.py`), falta el listado real de
 * instructores — ver
 * `_Docs/Documentación general/REGLAS_DE_NEGOCIO_CONOCIDAS.md`.
 */
const INSTRUCTORES: FilaInstructor[] = [
  { nombre: 'Claudia Pinzón', sigla: 'CP', especialidad: 'Comunicación · Investigación', jornada: 'Mañana' },
  { nombre: 'Sergio Garzón', sigla: 'SG', especialidad: 'Diseño de software', jornada: 'Noche' },
  { nombre: 'Erick Granados', sigla: 'EG', especialidad: 'Análisis · Verificación', jornada: 'Noche' },
  { nombre: 'Fredy Ardila', sigla: 'FA', especialidad: 'Bases de datos', jornada: 'Noche' },
  { nombre: 'Vanessa Gualaco', sigla: 'VG', especialidad: 'Medio Ambiente y SST', jornada: 'Noche' },
]

export function Instructores() {
  return (
    <AppShell activo="Instructores">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Instructores</h1>
        <p className="text-sm text-slate-500">
          Datos de ejemplo — pendiente el listado real (nombre, especialidad, sigla) de la
          coordinación. Ver{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">
            _Docs/Documentación general/REGLAS_DE_NEGOCIO_CONOCIDAS.md
          </code>
          .
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Sigla</th>
              <th className="px-4 py-3">Especialidad</th>
              <th className="px-4 py-3">Jornada habitual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {INSTRUCTORES.map((i) => (
              <tr key={i.sigla} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{i.nombre}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-sena-50 px-2 py-0.5 text-xs font-semibold text-sena-700">
                    {i.sigla}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{i.especialidad}</td>
                <td className="px-4 py-3 text-slate-600">{i.jornada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
