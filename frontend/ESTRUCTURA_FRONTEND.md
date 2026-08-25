# Estructura del frontend SIHS

## 1. Tecnologías utilizadas

El frontend utiliza únicamente las tecnologías definidas para el proyecto:

- **React:** construcción de la interfaz y componentes.
- **Vite:** servidor de desarrollo y compilación.
- **TypeScript:** tipado y seguridad del código.
- **React Router:** navegación entre páginas de React.
- **CSS:** estilos propios de la aplicación.

No se utiliza TailwindCSS ni otra herramienta de estilos externa.

## 2. Estructura general

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── ESTRUCTURA_FRONTEND.md
```

## 3. Archivos principales

### `src/main.tsx`

Es el punto de entrada de React. Busca el elemento `root` de `index.html` y monta la aplicación.

### `src/App.tsx`

Activa `BrowserRouter` y muestra `AppRouter`. Es el contenedor principal de la aplicación.

### `src/routes/AppRouter.tsx`

Define las rutas del sistema:

- Login y registro.
- Recuperación y cambio de contraseña.
- Dashboard.
- Usuarios e instructores.
- Fichas.
- Ambientes.
- Resultados de aprendizaje.
- Horarios.

También utiliza `ProtectedRoute` para evitar que una persona sin sesión acceda a las páginas privadas.

### `src/index.css`

Contiene la identidad visual del sistema: paleta azul formal, sidebar, barra superior, formularios, tablas, tarjetas, botones, estados vacíos y diseño responsive para computador y celular.

### `package.json`

Contiene los comandos y dependencias del frontend.

Comandos disponibles:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

## 4. Componentes reutilizables

### `src/components/Navbar.tsx`

Muestra la barra lateral y la barra superior. Incluye:

- Logo SIHS.
- Menú de navegación.
- Buscador global.
- Nombre y rol del usuario.
- Cierre de sesión.

El buscador global consulta fichas, ambientes, instructores y resultados de aprendizaje.

### `src/components/ProtectedRoute.tsx`

Comprueba si existe una sesión. Si no existe, redirige al login.

### `src/components/ui/Input.tsx`

Campo de entrada reutilizable para formularios. En los campos de contraseña incluye el botón para mostrar u ocultar el contenido.

### `src/components/ui/Select.tsx`

Campo reutilizable para listas desplegables.

### `src/components/ui/Button.tsx`

Botón reutilizable con estilos comunes.

### `src/components/common/PasswordStrengthIndicator.tsx`

Muestra visualmente el nivel de seguridad de la contraseña mediante una barra. No muestra textos decorativos como “Muy fuerte”.

### `src/components/InputField.tsx`

Componente alternativo de entrada para mantener compatibilidad con formularios que utilicen ese nombre.

## 5. Autenticación

### `src/pages/Login/Login.tsx`

Implementa el inicio de sesión con documento y contraseña. También controla hasta tres intentos dentro de la pantalla y ofrece enlaces de registro y recuperación.

### `src/pages/Register/Register.tsx`

Formulario principal de registro. Cambia los campos según el perfil:

- Coordinador.
- Instructor.
- Aprendiz.

Valida contraseña segura, confirmación, documento y correo únicos.

### `src/pages/Register/RegisterRole.tsx`

Permite elegir el perfil antes de iniciar el formulario de registro.

### `src/pages/Register/RegisterForm.tsx`

Reutiliza el formulario principal de registro.

### `src/pages/ForgotPassword/ForgotPassword.tsx`

Solicita el correo asociado a la cuenta para comenzar la recuperación.

### `src/pages/ForgotPassword/VerifyCode.tsx`

Solicita el código de recuperación y valida que no haya superado los dos minutos.

### `src/pages/ResetPassword/ResetPassword.tsx`

Permite crear y confirmar una nueva contraseña segura.

### `src/services/auth.service.ts`

Contiene la lógica de registro, login, recuperación, cambio de contraseña, consulta de sesión y cierre de sesión.

Actualmente utiliza `localStorage` como almacenamiento temporal porque el backend todavía no tiene los endpoints de autenticación implementados.

### `src/api/auth.api.ts`

Expone las operaciones de autenticación mediante una API interna del frontend. De esta forma, las páginas no tienen que conocer directamente los detalles del servicio.

### `src/hooks/useAuth.ts`

Hook reutilizable para ejecutar login y controlar el estado de carga.

### `src/utils/validation.ts`

Contiene la validación de contraseña segura:

- Mínimo 8 caracteres.
- Una mayúscula.
- Una minúscula.
- Un número.
- Un carácter especial.

## 6. Dashboards

### `src/pages/Dashboard/Dashboard.tsx`

Selecciona automáticamente el dashboard según el rol de la sesión.

### `src/pages/Dashboard/CoordinatorDashboard.tsx`

Dashboard para coordinación. Incluye:

- Total de ambientes.
- Instructores activos.
- Aprendices.
- Horarios programados.
- Horario del día.
- Acciones rápidas.

Las tarjetas son clicables y llevan a los módulos correspondientes.

### `src/pages/Dashboard/InstructorDashboard.tsx`

Dashboard para instructores. Muestra fichas asignadas, horas semanales, ambientes y próxima clase.

### `src/pages/Dashboard/LearnerDashboard.tsx`

Dashboard para aprendices. Muestra ficha, clases, ambientes y próxima clase, además de accesos a horario y ficha.

### `src/pages/SearchResults.tsx`

Muestra los resultados del buscador superior.

## 7. Módulo de usuarios e instructores

### `src/pages/Users/UsersList.tsx`

Lista usuarios registrados y permite filtrar por nombre, documento o perfil.

### `src/pages/Users/UserDetail.tsx`

Muestra la información detallada de un usuario.

### `src/pages/Users/EditUser.tsx`

Permite modificar información básica de usuarios.

### `src/api/users.api.ts`

Gestiona la lectura y actualización temporal de usuarios.

### `src/pages/Instructors/InstructorCode.tsx`

Permite al coordinador generar códigos únicos para el registro de instructores.

### `src/api/instructors.api.ts`

Lista instructores, genera códigos y valida si un código existe.

## 8. Módulo de ambientes

### `src/pages/Environments/EnvironmentsList.tsx`

Lista los ambientes ordenados por número.

### `src/pages/Environments/CreateEnvironment.tsx`

Registra ambientes con número, sede, tipo, nombre y estado.

### `src/pages/Environments/EditEnvironment.tsx`

Ruta destinada a la edición de ambientes.

### `src/api/environments.api.ts`

Gestiona ambientes y valida que no se repita el mismo número en una sede. También fuerza el nombre “Ambiente” para ambientes regulares.

## 9. Módulo de fichas

### `src/pages/Fiches/FichesList.tsx`

Lista las fichas y permite buscarlas por número.

### `src/pages/Fiches/CreateFiche.tsx`

Registra número de ficha, jornada, programa, área, nivel, trimestre, fechas, aprendices y estado.

### `src/pages/Fiches/EditFiche.tsx`

Ruta destinada a la edición de fichas.

### `src/api/fiches.api.ts`

Gestiona fichas y evita números repetidos.

## 10. Módulo de resultados de aprendizaje

### `src/pages/LearningResults/LearningResultsList.tsx`

Lista resultados y permite buscar por nombre o acrónimo.

### `src/pages/LearningResults/CreateLearningResult.tsx`

Registra código, nombre, trimestre, programa, horas y acrónimo.

### `src/pages/LearningResults/EditLearningResult.tsx`

Ruta destinada a la edición de resultados.

### `src/api/learningResults.api.ts`

Evita resultados repetidos por código o nombre.

## 11. Módulo de horarios

### `src/pages/Schedules/ScheduleList.tsx`

Lista bloques de horarios y permite filtrar por número de ficha.

### `src/pages/Schedules/CreateSchedule.tsx`

Permite registrar día, jornada, bloque, ficha, instructor, resultado y ambiente.

### `src/pages/Schedules/EditSchedule.tsx`

Ruta destinada a modificar bloques de horario.

### `src/pages/Schedules/ScheduleCalendar.tsx`

Presenta los horarios organizados de lunes a sábado.

### `src/api/schedules.api.ts`

Gestiona los bloques de horario.

## 12. Tipos TypeScript

La carpeta `src/types/` define la forma de los datos:

- `auth.ts` y `auth.types.ts`: roles, usuario autenticado y login.
- `user.types.ts`: usuarios.
- `environment.types.ts`: ambientes.
- `fiche.types.ts`: fichas.
- `learningResult.types.ts`: resultados de aprendizaje.
- `schedule.types.ts`: bloques horarios.

Los tipos ayudan a detectar errores antes de ejecutar la aplicación.

## 13. Relación con los requisitos

| Requisito | Funcionalidad | Archivos principales |
|---|---|---|
| 001 | Login | `Login.tsx`, `auth.service.ts`, `ProtectedRoute.tsx` |
| 002 | Registro por perfil | `Register.tsx`, `RegisterRole.tsx`, `auth.service.ts` |
| 003 | Recuperación de usuario | `ForgotPassword.tsx`, `VerifyCode.tsx`, `ResetPassword.tsx` |
| 004 | Modificar usuarios | `UsersList.tsx`, `UserDetail.tsx`, `EditUser.tsx` |
| 005 | Registrar resultados | `CreateLearningResult.tsx`, `learningResults.api.ts` |
| 006 | Registrar ambientes | `CreateEnvironment.tsx`, `environments.api.ts` |
| 007 | Modificar ambientes | `EnvironmentsList.tsx`, `EditEnvironment.tsx` |
| 008 | Registrar instructores | `InstructorCode.tsx`, `instructors.api.ts`, `Register.tsx` |
| 009 | Registrar fichas | `CreateFiche.tsx`, `fiches.api.ts` |
| 010 | Actualizar fichas | `FichesList.tsx`, `EditFiche.tsx` |
| 011 | Registrar horarios | `CreateSchedule.tsx`, `ScheduleCalendar.tsx` |
| 012 | Listar horarios | `ScheduleList.tsx`, `ScheduleCalendar.tsx` |
| 013 | Modificar horarios | `EditSchedule.tsx`, `schedules.api.ts` |
| 014 | Listar resultados | `LearningResultsList.tsx`, `learningResults.api.ts` |
| 015 | Modificar resultados | `EditLearningResult.tsx`, `learningResults.api.ts` |

## 14. Estado actual

El frontend ya tiene navegación, formularios, validaciones, dashboards, filtros, tarjetas interactivas y estilos institucionales.

La compilación y lint se ejecutan con:

```powershell
npm run build
npm run lint
```

En este momento, las operaciones usan `localStorage` para permitir probar la interfaz. Para cumplir completamente la arquitectura REST de producción, el backend debe implementar los endpoints y luego las APIs del frontend deben cambiar el almacenamiento local por solicitudes HTTP.
