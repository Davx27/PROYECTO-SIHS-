# Backend SIHS

API REST construida con FastAPI.

## Requisitos

- Python instalado.
- Docker Desktop instalado y en ejecucion.

## Iniciar la base de datos

Desde la raiz del proyecto, ejecuta:

```powershell
docker compose -f database/docker-compose.yml up -d
```

Este comando inicia PostgreSQL en el contenedor `postgres_sihs`, crea la base
de datos `sistema_sihs` y carga los scripts SQL iniciales la primera vez que se
crea el volumen.

## Ejecutar el backend

Desde la raiz del proyecto:

```powershell
cd backend
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Si el entorno virtual todavia no existe, crealo antes de activarlo:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

La API estara disponible en `http://127.0.0.1:8000`.

Documentacion automatica:

- Swagger UI: `http://127.0.0.1:8000/docs`
- Endpoint de salud: `http://127.0.0.1:8000/api/v1/health`

El endpoint de salud debe responder:

```json
{"status":"ok"}
```

La conexion a PostgreSQL se configura mediante `DATABASE_URL` en el archivo
`.env`. No subas `.env` a GitHub; utiliza `.env.example` como referencia.

## Pruebas

Con el entorno virtual activado, ejecuta desde la carpeta `backend`:

```powershell
pytest
```

## Detener la base de datos

Para detener el contenedor sin borrar los datos:

```powershell
docker compose -f database/docker-compose.yml down
```

No uses `down -v` salvo que quieras borrar completamente el volumen y todos
los datos de prueba de PostgreSQL.
