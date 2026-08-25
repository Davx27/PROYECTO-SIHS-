# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# Frontend SIHS

Interfaz web del Sistema Integrado de Horarios. Está desarrollada con React, Vite y TypeScript, y permite gestionar la información de usuarios, fichas, ambientes, resultados de aprendizaje y horarios.

## Tecnologías

- React
- Vite
- TypeScript
- React Router para la navegación
- CSS propio para los estilos

No se utiliza TailwindCSS ni otra tecnología de estilos externa.

## Requisitos previos

Debes tener instalado:

- Node.js
- npm

## Instalación

Desde la carpeta del frontend, ejecuta:

```powershell
cd C:\Users\Wilfer\OneDrive\Desktop\PROYECTO-SIHS\PROYECTO-SIHS-\frontend
npm install
```

## Ejecución en desarrollo

```powershell
npm run dev
```

Después abre la dirección que muestre Vite, normalmente:

```text
http://127.0.0.1:5173/
```

## Comandos disponibles

### Iniciar el servidor

```powershell
npm run dev
```

### Compilar para producción

```powershell
npm run build
```

### Revisar el código con ESLint

```powershell
npm run lint
```

### Ver la compilación de producción

```powershell
npm run preview
```

## Estructura del frontend

```text
src/
├── api/          Operaciones de datos de cada módulo
├── components/   Componentes reutilizables de la interfaz
├── hooks/        Lógica reutilizable de React
├── pages/        Páginas del sistema
├── routes/       Rutas y protección de acceso
├── services/     Servicios, especialmente autenticación
├── types/        Tipos de datos de TypeScript
├── utils/        Validaciones auxiliares
├── App.tsx       Contenedor principal
├── index.css     Estilos generales y diseño visual
└── main.tsx      Punto de entrada de React
```

## Módulos implementados

- Inicio de sesión.
- Registro de coordinadores, instructores y aprendices.
- Recuperación y cambio de contraseña.
- Dashboard según el perfil del usuario.
- Gestión de usuarios.
- Generación de códigos de instructor.
- Gestión de ambientes de formación.
- Gestión de fichas.
- Gestión de resultados de aprendizaje.
- Registro, consulta y edición de horarios.
- Búsquedas por ficha, nombre, acrónimo, instructor y ambiente.

## Autenticación de prueba

Mientras se implementan los endpoints del backend, los usuarios y registros se almacenan temporalmente en el `localStorage` del navegador.

Para probar el sistema:

1. Abre la aplicación.
2. Selecciona `Registrarme`.
3. Completa el formulario según el perfil.
4. Usa una contraseña con mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.
5. Regresa al inicio de sesión.
6. Ingresa el mismo documento y contraseña.

Ejemplo de contraseña válida:

```text
MiClave2026!
```

## Backend

El frontend está preparado para consumir una API REST. Actualmente el backend del proyecto solo tiene disponible el endpoint de salud, por lo que las operaciones de prueba utilizan almacenamiento local.

Cuando se implementen los endpoints de FastAPI, las funciones de `src/api/` y `src/services/` podrán conectarse a la API y a PostgreSQL.

## Documentación adicional

La explicación detallada de cada archivo y su relación con los requisitos 001 al 015 está en:

`ESTRUCTURA_FRONTEND.md`

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
