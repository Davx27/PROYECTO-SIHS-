import { AppShell } from '../components/AppShell'

interface FilaFicha {
  codigo: string
  programa: string
  nivel: 'Tecnólogo' | 'Técnico'
  trimestre: number
  jornada: string
  aprendices: number
}

/**
 * Datos de ejemplo — el código y el programa de la primera fila son los
 * mismos que ya usa `NuevoHorario.tsx` (ficha 3228973 B, Análisis y
 * Desarrollo de Software) para que el demo sea consistente. La mayoría de
 * programas sale de los 14 que mencionó el coordinador de Teleinformática
 * (8 tecnólogos + 6 técnicos); la ficha 3068356 es la que usó como ejemplo
 * el coordinador de Logística (6° trimestre, tarde, Coordinación de
 * Procesos Logísticos — programa con 18 guías y 91 resultados de
 * aprendizaje en 7 trimestres). Backend: `coordinaciones` → `programas` →
 * `trimestres` → `fichas` todavía no existe en código (siguiente paso
 * desbloqueado del roadmap) — ver
 * `_Docs/Documentación general/REGLAS_DE_NEGOCIO_CONOCIDAS.md`.
 */
const FICHAS: FilaFicha[] = [
  { codigo: '3228973 B', programa: 'Análisis y Desarrollo de Software', nivel: 'Tecnólogo', trimestre: 3, jornada: 'Mañana', aprendices: 30 },
  { codigo: '2758431', programa: 'Análisis y Desarrollo de Software', nivel: 'Tecnólogo', trimestre: 3, jornada: 'Noche', aprendices: 32 },
  { codigo: '2691205', programa: 'Gestión de Redes de Datos', nivel: 'Tecnólogo', trimestre: 2, jornada: 'Tarde', aprendices: 28 },
  { codigo: '2744309', programa: 'Implementación de Infraestructura', nivel: 'Tecnólogo', trimestre: 4, jornada: 'Mañana', aprendices: 30 },
  { codigo: '2803577', programa: 'Técnico en Programación de Software', nivel: 'Técnico', trimestre: 1, jornada: 'Tarde', aprendices: 35 },
  { codigo: '2712880', programa: 'Técnico en Sistemas Teleinformáticos', nivel: 'Técnico', trimestre: 2, jornada: 'Noche', aprendices: 30 },
  { codigo: '2766142', programa: 'Seguridad Digital', nivel: 'Técnico', trimestre: 1, jornada: 'Noche', aprendices: 30 },
  { codigo: '3068356', programa: 'Tecnología en Coordinación de Procesos Logísticos', nivel: 'Tecnólogo', trimestre: 6, jornada: 'Tarde', aprendices: 30 },
]

const estiloNivel: Record<FilaFicha['nivel'], string> = {
  Tecnólogo: 'bg-sena-50 text-sena-700',
  Técnico: 'bg-sky-50 text-sky-700',
}

export function Fichas() {
  return (
    <AppShell activo="Fichas">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Fichas</h1>
        <p className="text-sm text-slate-500">
          Datos de ejemplo — pendiente el listado real por trimestre. Ver{' '}
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
              <th className="px-4 py-3">Ficha</th>
              <th className="px-4 py-3">Programa</th>
              <th className="px-4 py-3">Nivel</th>
              <th className="px-4 py-3">Trimestre</th>
              <th className="px-4 py-3">Jornada</th>
              <th className="px-4 py-3">Aprendices</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {FICHAS.map((f) => (
              <tr key={f.codigo} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{f.codigo}</td>
                <td className="px-4 py-3 text-slate-600">{f.programa}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estiloNivel[f.nivel]}`}>
                    {f.nivel}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{f.trimestre}°</td>
                <td className="px-4 py-3 text-slate-600">{f.jornada}</td>
                <td className="px-4 py-3 text-slate-600">{f.aprendices}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
