import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Registro } from '../pages/Registro'
import { RecuperarContrasena } from '../pages/RecuperarContrasena'
import { Dashboard } from '../pages/Dashboard'
import { ProtectedRoute } from './ProtectedRoute'

/**
 * Todas las rutas de la app viven acá. Para agregar una página nueva:
 *   1. Crear el componente en src/pages/.
 *   2. Importarlo arriba.
 *   3. Agregar un <Route> — si necesita sesión iniciada, envolverlo en
 *      <ProtectedRoute> como está Dashboard.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
