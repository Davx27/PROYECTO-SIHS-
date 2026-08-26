# Qué falta en el frontend para cumplir el objetivo del proyecto

Igual que `backend/OBJETIVO_Y_SERVICIOS_FALTANTES.md`, pero del lado del
frontend. Léanlo junto con ese — cada pantalla nueva de acá depende de que
el módulo correspondiente exista primero en el backend.

## Lo que ya existe (funcionando de verdad, no solo maquetado)

- **Login / Registro / Recuperar contraseña** — conectadas a Supabase Auth,
  probadas con usuarios reales.
- **Dashboard** — perfil propio, conteo de usuarios y lista de roles, todo
  vía el backend real (`GET /usuarios/me`, `GET /usuarios`, `GET /roles`),
  con manejo honesto de "no tienes permiso" cuando el rol no alcanza.
- Identidad visual institucional SENA aplicada (verde `#39A900`, logo
  oficial) — ver `_Docs/Diseño/mockups-institucionales/` para los mockups
  originales que se usaron de referencia.

## Lo que falta (en el mismo orden que el backend)

El Dashboard actual ya tiene el espacio reservado en el sidebar para estos
módulos (aparecen en gris, marcados "pronto") — cuando el backend tenga el
endpoint, se activan quitando el `disabled`/estilo gris y agregando la ruta
en `AppRouter.tsx`.

| Pantalla | Depende de (backend) | Qué debería mostrar |
|---|---|---|
| Ambientes | módulo `ambientes` | Lista de aulas/labs por sede, crear/editar |
| Instructores | módulo `usuarios` + `especialidades` | Lista de instructores con su(s) especialidad(es) |
| Fichas | módulo `fichas`/`programas`/`trimestres` | Fichas activas por trimestre |
| **Horarios** | módulo `horarios` — **el objetivo real del sistema** | Calendario/tabla de horarios, con aviso visual cuando el backend detecte un cruce |
| Reportes | depende de qué pida la coordinación | Fuera de alcance hasta que se defina — no hay requisito claro todavía en `_Docs/Informes de requisitos/` |

## Sección de estudiantes (planeada, no programada todavía)

Dos pantallas nuevas para el rol `Aprendiz` (ya existe, sembrado en
`database/02_datos_prueba.sql`): ingresar su ficha y ver su horario de la
semana en modo solo lectura. Bloqueada por lo mismo que `Fichas`/`Horarios`
arriba, más enrutamiento por rol que hoy no existe (`ProtectedRoute.tsx`
solo revisa que haya sesión, no el rol) — el detalle completo y las
preguntas de diseño sin resolver están en
[`_Docs/Documentación general/SECCION_ESTUDIANTES.md`](../_Docs/Documentación%20general/SECCION_ESTUDIANTES.md).

## Otras cosas pendientes, no ligadas a un módulo nuevo

- **Aprobar solicitudes de registro.** Hoy alguien se registra y queda sin
  rol hasta que un Administrador lo asigna a mano (ver "Sobre el registro y
  los roles" en `ESTRUCTURA.md`). Una pantalla simple para que el
  Administrador vea usuarios sin rol y les asigne uno (usa
  `POST /usuario-rol/asignar`, que ya existe) resolvería esto sin depender
  de ningún módulo nuevo del backend — es la mejora de UI más rápida de
  hacer con lo que ya hay.
- **Manejo de errores más allá de 403.** `api.ts` ya distingue errores de
  permisos; falta decidir qué mostrar ante un 500 o timeout del backend
  (hoy no se maneja explícitamente en las páginas).
- **Responsive / mobile.** Las pantallas se probaron en escritorio; el
  sidebar del Dashboard se oculta en pantallas chicas (`hidden sm:block`)
  pero no hay un menú alterno para mobile todavía.
- **Tests de frontend.** No hay ninguno. Si se agrega, Vitest es la opción
  natural (mismo ecosistema que Vite, cero configuración extra).
