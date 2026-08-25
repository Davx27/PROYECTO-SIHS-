from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.health import router as health_router
from app.api.v1.roles import router as roles_router
from app.api.v1.usuario_rol import router as usuario_rol_router
from app.api.v1.usuarios import router as usuarios_router
from app.core.config import settings

app = FastAPI(title=settings.app_name)

# Desarrollo: acepta cualquier puerto de localhost (Vite salta al siguiente
# puerto libre — 5174, 5175... — si 5173 ya está ocupado por otro proyecto,
# así que fijar un solo puerto rompe el CORS en silencio). Antes de
# producción, reemplazar por la URL real desplegada con allow_origins.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(usuarios_router, prefix="/api/v1")
app.include_router(roles_router, prefix="/api/v1")
app.include_router(usuario_rol_router, prefix="/api/v1")
