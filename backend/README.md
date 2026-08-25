# Backend SIHS

API REST construida con FastAPI.

## Ejecutar

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

La API estará disponible en `http://127.0.0.1:8000` y su documentación en `/docs`.

La conexión a PostgreSQL se configura mediante `DATABASE_URL` — ver
[`../database/README.md`](../database/README.md) para conseguir las
credenciales de Supabase.

## Para seguir programando

- [`ESTRUCTURA.md`](./ESTRUCTURA.md) — qué es cada carpeta/archivo y el
  patrón a seguir para armar un módulo nuevo.
- [`OBJETIVO_Y_SERVICIOS_FALTANTES.md`](./OBJETIVO_Y_SERVICIOS_FALTANTES.md) —
  qué módulos faltan para cumplir el objetivo del proyecto y en qué orden.
- [`PENDIENTE_MVP.md`](./PENDIENTE_MVP.md) — lo urgente para el demo de 24h.

## Pruebas

```powershell
pytest
```
