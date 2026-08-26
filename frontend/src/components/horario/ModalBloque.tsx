import { useState } from 'react'
import type { FormEvent } from 'react'
import type { BloqueClase } from '../../pages/horario/tipos'

export interface DatosBloque {
  tematica: string
  instructor: string
  ficha: string
  ambiente: string
}

interface ModalBloqueProps {
  /** Si viene un bloque existente, el modal edita sus datos; si no, crea uno nuevo. */
  bloqueInicial?: BloqueClase
  onGuardar: (datos: DatosBloque) => void
  onCancelar: () => void
}

function datosVacios(bloque?: BloqueClase): DatosBloque {
  return {
    tematica: bloque?.tematica ?? '',
    instructor: bloque?.instructor ?? '',
    ficha: bloque?.ficha ?? '',
    ambiente: bloque?.ambiente ?? '',
  }
}

/**
 * Formulario modal para crear o editar un bloque de clase. Como los bloques
 * son reutilizables (una definición, muchas celdas asignadas), este es el
 * único lugar donde se escriben temática/instructor/ficha/ambiente a mano —
 * ver `frontend/ESTRUCTURA.md#pantalla-de-horarios` para el flujo completo.
 */
export function ModalBloque({ bloqueInicial, onGuardar, onCancelar }: ModalBloqueProps) {
  const [datos, setDatos] = useState<DatosBloque>(() => datosVacios(bloqueInicial))
  const esEdicion = bloqueInicial !== undefined

  function actualizarCampo(campo: keyof DatosBloque, valor: string) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }))
  }

  function manejarSubmit(evento: FormEvent) {
    evento.preventDefault()
    onGuardar(datos)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-bloque-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 id="modal-bloque-titulo" className="mb-4 text-lg font-bold text-slate-900">
          {esEdicion ? 'Editar bloque de clase' : 'Nuevo bloque de clase'}
        </h2>

        <form onSubmit={manejarSubmit}>
          <CampoModal etiqueta="Temática" htmlFor="bloque-tematica">
            <input
              id="bloque-tematica"
              value={datos.tematica}
              onChange={(e) => actualizarCampo('tematica', e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sena-600 focus:ring-1 focus:ring-sena-600 focus:outline-none"
            />
          </CampoModal>
          <CampoModal etiqueta="Instructor" htmlFor="bloque-instructor">
            <input
              id="bloque-instructor"
              value={datos.instructor}
              onChange={(e) => actualizarCampo('instructor', e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sena-600 focus:ring-1 focus:ring-sena-600 focus:outline-none"
            />
          </CampoModal>
          <CampoModal etiqueta="Ficha" htmlFor="bloque-ficha">
            <input
              id="bloque-ficha"
              value={datos.ficha}
              onChange={(e) => actualizarCampo('ficha', e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sena-600 focus:ring-1 focus:ring-sena-600 focus:outline-none"
            />
          </CampoModal>
          <CampoModal etiqueta="Ambiente" htmlFor="bloque-ambiente">
            <input
              id="bloque-ambiente"
              value={datos.ambiente}
              onChange={(e) => actualizarCampo('ambiente', e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sena-600 focus:ring-1 focus:ring-sena-600 focus:outline-none"
            />
          </CampoModal>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sena-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sena-700"
            >
              Guardar bloque
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CampoModal({
  etiqueta,
  htmlFor,
  children,
}: {
  etiqueta: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {etiqueta}
      </label>
      {children}
    </div>
  )
}
