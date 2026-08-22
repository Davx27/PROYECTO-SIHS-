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

La conexión a PostgreSQL se configurará mediante `DATABASE_URL` cuando se reciba la información de la base de datos.

## Pruebas

```powershell
pytest
```
