import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { FormField } from '../components/FormField'
import { supabase } from '../services/supabaseClient'

type RolSolicitado = 'Coordinador' | 'Instructor'

/**
 * El registro también habla directo con Supabase Auth (supabase.auth.signUp).
 * El rol elegido en el formulario NO asigna un rol real todavía — se guarda
 * como metadata del usuario (rol_solicitado) para que un Administrador lo
 * revise y lo asigne de verdad después con POST /usuario-rol/asignar (ver
 * backend/app/api/v1/usuario_rol.py). Por eso el mensaje de éxito dice
 * "quedó pendiente de aprobación" en vez de meter a la persona directo al
 * dashboard — coincide con lo que dice el mockup 02-registro.png.
 */
export function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [rol, setRol] = useState<RolSolicitado>('Coordinador')
  const [aceptaPolitica, setAceptaPolitica] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (!aceptaPolitica) {
      setError('Debes aceptar el tratamiento de datos personales.')
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, rol_solicitado: rol } },
    })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    navigate('/login', { state: { registroExitoso: true } })
  }

  return (
    <AuthLayout>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Crear cuenta</h1>
      <p className="mb-6 text-sm text-slate-500">
        Tu solicitud será validada por la coordinación académica del centro.
      </p>

      <form onSubmit={handleSubmit}>
        <FormField
          id="nombre"
          label="Nombre completo"
          placeholder="Ej. Laura Camila Restrepo Duarte"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <FormField
          id="email"
          label="Correo institucional"
          type="email"
          placeholder="nombre.apellido@sena.edu.co"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="mb-4 grid grid-cols-2 gap-3">
          <FormField
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <FormField
            id="confirmarPassword"
            label="Confirmar contraseña"
            type="password"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
          />
        </div>

        <p className="mb-4 -mt-2 text-sm font-medium text-slate-700">Rol en el centro</p>
        <div className="mb-4 grid grid-cols-2 gap-3">
          {(['Coordinador', 'Instructor'] as const).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setRol(opcion)}
              className={`rounded-lg border px-4 py-3 text-left transition ${
                rol === opcion
                  ? 'border-sena-600 bg-sena-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <span className="block font-semibold text-slate-900">{opcion}</span>
              <span className="text-xs text-slate-500">
                {opcion === 'Coordinador' ? 'Programa y aprueba' : 'Consulta su carga'}
              </span>
            </button>
          ))}
        </div>

        <label className="mb-5 flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={aceptaPolitica}
            onChange={(e) => setAceptaPolitica(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sena-600"
          />
          Acepto el tratamiento de mis datos personales conforme a la política institucional del
          SENA.
        </label>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sena-600 py-3 font-semibold text-white transition hover:bg-sena-700 disabled:opacity-60"
        >
          {loading ? 'Enviando…' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Ya tengo cuenta ·{' '}
        <Link to="/login" className="font-semibold text-sena-700 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  )
}
