from fastapi import FastAPI

from app.api.v1.health import router as health_router
from app.api.v1.ambientes import router as ambientes_router
from app.api.v1.sedes import router as sedes_router
from app.core.config import settings

app = FastAPI(title=settings.app_name)
app.include_router(health_router, prefix="/api/v1")
app.include_router(sedes_router, prefix="/api/v1")
app.include_router(ambientes_router, prefix="/api/v1")
