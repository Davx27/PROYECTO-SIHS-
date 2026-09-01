import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { apiGet } from '../services/api'
import type { Ambiente } from '../types/api'

interface Sede {
  idSede: number
  nombreSede: string
  direccion: string | null
  tipoSede: 'principal' | 'secundaria' | 'alterna' | null
}

type Orden = 'numero' | 'nombre' | 'sede' | 'tipo' | 'estado'
type Direccion = 'asc' | 'desc'

const estiloEstado: Record<Ambiente['estadoAmbiente'], string> = {
  disponible: 'bg-emerald-50 text-emerald-700',
  mantenimiento: 'bg-orange-50 text-orange-700',
  inactivo: 'bg-slate-100 text-slate-600',
}

const textoEstado: Record<Ambiente['estadoAmbiente'], string> = {
  disponible: 'Disponible',
  mantenimiento: 'Mantenimiento',
  inactivo: 'Inactivo',
}

const textoTipo: Record<Ambiente['tipoAmbiente'], string> = {
  regular: 'Regular',
  especial: 'Especial',
}

export function Ambientes() {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [busqueda, setBusqueda] = useState('')
  const [sedeFiltro, setSedeFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')

  const [orden, setOrden] = useState<Orden>('numero')
  const [direccion, setDireccion] = useState<Direccion>('asc')

  const [ambienteSeleccionado, setAmbienteSeleccionado] = useState<Ambiente | null>(null)

  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        setCargando(true)
        setError(null)

        const [ambientesData, sedesData] = await Promise.all([
          apiGet<Ambiente[]>('/ambientes'),
          apiGet<Sede[]>('/sedes'),
        ])

        if (!activo) return

        setAmbientes(ambientesData)
        setSedes(sedesData)
      } catch (err) {
        if (!activo) return

        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible cargar los ambientes.',
        )
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    void cargarDatos()

    return () => {
      activo = false
    }
  }, [])

  const nombreSede = (idSede: number) => {
    return sedes.find((sede) => sede.idSede === idSede)?.nombreSede ?? `Sede ${idSede}`
  }

  const ambientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    const resultado = ambientes.filter((ambiente) => {
      const sede = nombreSede(ambiente.idSede).toLowerCase()

      const coincideBusqueda =
        !termino ||
        String(ambiente.numeroAmbiente).includes(termino) ||
        ambiente.nombreAmbiente.toLowerCase().includes(termino) ||
        sede.includes(termino)

      const coincideSede =
        !sedeFiltro || String(ambiente.idSede) === sedeFiltro

      const coincideEstado =
        !estadoFiltro || ambiente.estadoAmbiente === estadoFiltro

      return coincideBusqueda && coincideSede && coincideEstado
    })

    return [...resultado].sort((a, b) => {
      let valorA: string | number
      let valorB: string | number

      switch (orden) {
        case 'numero':
          valorA = a.numeroAmbiente
          valorB = b.numeroAmbiente
          break

        case 'nombre':
          valorA = a.nombreAmbiente.toLowerCase()
          valorB = b.nombreAmbiente.toLowerCase()
          break

        case 'sede':
          valorA = nombreSede(a.idSede).toLowerCase()
          valorB = nombreSede(b.idSede).toLowerCase()
          break

        case 'tipo':
          valorA = a.tipoAmbiente
          valorB = b.tipoAmbiente
          break

        case 'estado':
          valorA = a.estadoAmbiente
          valorB = b.estadoAmbiente
          break
      }

      if (valorA < valorB) return direccion === 'asc' ? -1 : 1
      if (valorA > valorB) return direccion === 'asc' ? 1 : -1

      return 0
    })
  }, [ambientes, busqueda, sedeFiltro, estadoFiltro, orden, direccion, sedes])

  const total = ambientes.length
  const disponibles = ambientes.filter(
    (ambiente) => ambiente.estadoAmbiente === 'disponible',
  ).length
  const mantenimiento = ambientes.filter(
    (ambiente) => ambiente.estadoAmbiente === 'mantenimiento',
  ).length
  const inactivos = ambientes.filter(
    (ambiente) => ambiente.estadoAmbiente === 'inactivo',
  ).length

  const cambiarOrden = (campo: Orden) => {
    if (orden === campo) {
      setDireccion((actual) => (actual === 'asc' ? 'desc' : 'asc'))
      return
    }

    setOrden(campo)
    setDireccion('asc')
  }

  const indicadorOrden = (campo: Orden) => {
    if (orden !== campo) return ''
    return direccion === 'asc' ? ' ↑' : ' ↓'
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setSedeFiltro('')
    setEstadoFiltro('')
  }

  return (
    <AppShell activo="Ambientes">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Ambientes</h1>
        <p className="text-sm text-slate-500">
          Consulta y administra la disponibilidad de los ambientes registrados.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Total ambientes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{total}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Disponibles</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{disponibles}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">En mantenimiento</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">{mantenimiento}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Inactivos</p>
          <p className="mt-2 text-3xl font-bold text-slate-600">{inactivos}</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_220px_auto]">
          <input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar ambiente..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sena-500 focus:ring-2 focus:ring-sena-100"
          />

          <select
            value={sedeFiltro}
            onChange={(event) => setSedeFiltro(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sena-500 focus:ring-2 focus:ring-sena-100"
          >
            <option value="">Todas las sedes</option>
            {sedes.map((sede) => (
              <option key={sede.idSede} value={sede.idSede}>
                {sede.nombreSede}
              </option>
            ))}
          </select>

          <select
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sena-500 focus:ring-2 focus:ring-sena-100"
          >
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {cargando ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Cargando ambientes...
          </div>
        ) : ambientesFiltrados.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-700">
              No se encontraron ambientes
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Prueba cambiando los filtros de búsqueda.
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-100 px-4 py-3 text-sm text-slate-500">
              Mostrando{' '}
              <span className="font-semibold text-slate-700">
                {ambientesFiltrados.length}
              </span>{' '}
              de{' '}
              <span className="font-semibold text-slate-700">{total}</span>{' '}
              ambientes
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => cambiarOrden('numero')}
                        className="hover:text-slate-900"
                      >
                        Ambiente{indicadorOrden('numero')}
                      </button>
                    </th>

                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => cambiarOrden('nombre')}
                        className="hover:text-slate-900"
                      >
                        Nombre{indicadorOrden('nombre')}
                      </button>
                    </th>

                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => cambiarOrden('sede')}
                        className="hover:text-slate-900"
                      >
                        Sede{indicadorOrden('sede')}
                      </button>
                    </th>

                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => cambiarOrden('tipo')}
                        className="hover:text-slate-900"
                      >
                        Tipo{indicadorOrden('tipo')}
                      </button>
                    </th>

                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => cambiarOrden('estado')}
                        className="hover:text-slate-900"
                      >
                        Estado{indicadorOrden('estado')}
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {ambientesFiltrados.map((ambiente) => (
                    <tr
                      key={ambiente.idAmbiente}
                      onClick={() => setAmbienteSeleccionado(ambiente)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {ambiente.numeroAmbiente}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {ambiente.nombreAmbiente}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {nombreSede(ambiente.idSede)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {textoTipo[ambiente.tipoAmbiente]}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estiloEstado[ambiente.estadoAmbiente]}`}
                        >
                          {textoEstado[ambiente.estadoAmbiente]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {ambienteSeleccionado && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Cerrar panel"
            onClick={() => setAmbienteSeleccionado(null)}
            className="absolute inset-0 h-full w-full cursor-default bg-slate-900/30"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Detalle del ambiente
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Ambiente {ambienteSeleccionado.numeroAmbiente}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setAmbienteSeleccionado(null)}
                className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Estado
                </p>
                <div className="mt-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estiloEstado[ambienteSeleccionado.estadoAmbiente]}`}
                  >
                    {textoEstado[ambienteSeleccionado.estadoAmbiente]}
                  </span>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Número
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {ambienteSeleccionado.numeroAmbiente}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Tipo
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {textoTipo[ambienteSeleccionado.tipoAmbiente]}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Nombre
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {ambienteSeleccionado.nombreAmbiente}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Sede
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {nombreSede(ambienteSeleccionado.idSede)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  ID del ambiente
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {ambienteSeleccionado.idAmbiente}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 p-6">
              <button
                type="button"
                onClick={() => setAmbienteSeleccionado(null)}
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Cerrar
              </button>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  )
}
