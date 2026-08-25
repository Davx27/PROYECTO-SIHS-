# Estructura del backend — qué es cada cosa

Guía para entender el código sin tener que preguntar. Si van a programar un
módulo nuevo (ver `OBJETIVO_Y_SERVICIOS_FALTANTES.md`), este documento les
dice exactamente qué archivos crear y en qué orden, usando `roles` como
ejemplo real que ya funciona.

## Mapa de carpetas

```text
backend/
├── app/
│   ├── main.py              # Arranca la app y registra las rutas. Solo se toca para agregar un módulo nuevo.
│   ├── core/                 # Configuración y piezas transversales (no son "un módulo", las usa todo el proyecto)
│   │   ├── config.py          # Lee las variables de .env (URLs, contraseñas, claves)
│   │   ├── database.py        # Conexión a Supabase (SQLAlchemy) — engine, sesión, Base
│   │   └── supabase_auth.py   # Verifica el token de login y controla permisos por rol
│   ├── models/                # Un archivo por tabla — le dice a SQLAlchemy cómo es cada tabla
│   ├── schemas/                # Un archivo por módulo — la forma de los datos que entran/salen de la API
│   ├── repositories/           # Un archivo por módulo — las consultas a la base de datos, sin lógica de negocio
│   ├── services/                # Un archivo por módulo — la lógica de negocio (reglas, validaciones)
│   └── api/v1/                   # Un archivo por módulo — las rutas HTTP (lo que llama el frontend)
├── tests/                    # Pruebas automáticas
├── requirements.txt          # Librerías de Python que hay que instalar
├── .env / .env.example       # Credenciales (real / plantilla)
├── PENDIENTE_MVP.md           # Qué falta para el demo de 24h
└── OBJETIVO_Y_SERVICIOS_FALTANTES.md  # Qué falta para cumplir el proyecto completo
```

## El patrón: 4 capas, siempre en el mismo orden

Una petición HTTP pasa por 4 capas, cada una con una responsabilidad y nada
más que esa:

```text
api/v1/*.py  →  services/*.py  →  repositories/*.py  →  models/*.py
   (ruta)         (reglas)          (consulta a BD)      (tabla)
```

- **`models/`** — define la tabla. No tiene lógica, solo columnas.
- **`repositories/`** — solo consultas (`SELECT`, `INSERT`, etc.). Nunca
  decide si algo está permitido o no, solo ejecuta.
- **`services/`** — aquí van las reglas: "¿existe ya este rol?", "¿el
  usuario tiene permiso?", "¿este horario cruza con otro?". Usa el
  repositorio, nunca toca la base de datos directamente.
- **`api/v1/`** — la ruta HTTP. Recibe la petición, llama al service,
  devuelve la respuesta. No debería tener lógica de negocio adentro.

Y **`schemas/`** (Pydantic) no es una capa de flujo, es la forma de los
datos: qué puede entrar en un `POST` y qué se devuelve en la respuesta.

## Ejemplo completo: cómo está armado `roles` (cópienlo para un módulo nuevo)

| Archivo | Qué hace | Lo esencial |
|---|---|---|
| `app/models/rol.py` | Define la tabla `roles` | `class Rol(Base): __tablename__ = "roles"` + sus columnas |
| `app/schemas/rol.py` | Qué datos acepta/devuelve la API | `RolCreate` (lo que llega en un POST), `RolResponse` (lo que se devuelve) |
| `app/repositories/rol_repository.py` | Consultas SQL puras | `obtener_todos`, `obtener_por_id`, `crear`, `actualizar`, `eliminar` |
| `app/services/rol_service.py` | Reglas de negocio | Llama al repositorio; acá iría, por ejemplo, "no permitir nombres repetidos" si hiciera falta |
| `app/api/v1/roles.py` | Rutas HTTP | `GET /roles`, `POST /roles`, etc. — protegidas con `require_admin` |

**Para crear un módulo nuevo (ej. `ambientes`), copien esos 5 archivos,
cambien "Rol"/"rol" por "Ambiente"/"ambiente" y ajusten las columnas según
`database/01_creacion.sql`.** Al final, en `app/main.py` agreguen 2 líneas
(el `import` del router y el `app.include_router(...)`), igual que están
`roles_router` y `usuarios_router`.

## `app/core/` — lo que no es un módulo pero todo módulo necesita

- **`config.py`**: lee `backend/.env` (URL de Supabase, contraseña de la BD,
  claves). Si agregan una variable nueva al `.env`, tienen que declararla
  acá también o Python la ignora.
- **`database.py`**: crea la conexión a Supabase y define `get_db()`, la
  función que cada ruta usa para hablar con la base de datos
  (`db: Session = Depends(get_db)`).
- **`supabase_auth.py`**: valida el token que manda el frontend contra
  Supabase (no contra nuestra base de datos) y expone:
  - `get_current_user` — quién está haciendo la petición.
  - `require_admin`, `require_coordinador`, `require_instructor`,
    `require_aprendiz` — para proteger una ruta a un rol específico, se usa
    así: `usuario = Depends(require_admin)` como parámetro de la ruta.

## Cosas que ya NO existen (y por qué, para que no las busquen)

- **No hay `app/modules/`** (así estaba organizado el backend del proyecto
  anterior, por carpeta-por-módulo). Acá está organizado por capa (todos
  los `models` juntos, todos los `services` juntos) — es el esqueleto que
  ya traía este repo, se mantuvo así.
- **No hay capa de "controller" separada.** Las rutas en `api/v1/` hacen
  directamente lo que el proyecto anterior hacía en `controller.py` — una
  capa menos que mantener, es el estilo estándar de FastAPI.
- **No hay `password` en `usuarios` ni tabla `password_reset_tokens`.** Eso
  lo maneja Supabase Auth, no nuestro código (ver
  `_Docs/Documentación general/AUDITORIA_TECNICA.md` sección 6 si quieren el
  porqué completo).

## Cómo probar mientras programan

No hace falta escribir frontend para probar un endpoint nuevo:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

Abran `http://127.0.0.1:8000/docs` — ahí sale cada ruta, con botón
"Try it out". Para las rutas protegidas, hace falta un token de Supabase
(login normal desde donde sea, o ver el bootstrap del primer Administrador
en `PENDIENTE_MVP.md`) y pegarlo en el botón "Authorize" de arriba.
