import { supabase } from './supabaseClient'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Todas las llamadas al backend pasan por aquí. Se encarga de:
 *  1. Tomar el token de la sesión actual de Supabase (la que crea Login.tsx
 *     al iniciar sesión) y mandarlo como "Authorization: Bearer <token>".
 *  2. Convertir una respuesta no-2xx en un ApiError con el mensaje que
 *     devuelve FastAPI (el campo "detail").
 *
 * Para consumir un endpoint nuevo del backend, NO hace falta tocar este
 * archivo — solo llamar a apiGet/apiPost/etc. con la ruta, igual que en
 * Dashboard.tsx. Ver frontend/ESTRUCTURA.md para más detalle.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (session) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body?.detail ?? response.statusText)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const apiGet = <T>(path: string) => request<T>(path)

export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })

export const apiPut = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined })

export const apiDelete = <T>(path: string) => request<T>(path, { method: 'DELETE' })
