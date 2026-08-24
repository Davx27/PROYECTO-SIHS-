from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.supabase_auth import require_admin
from app.schemas.jornada import JornadaCreate, JornadaResponse, JornadaUpdate
from app.services.jornada_service import JornadaService

router = APIRouter(prefix="/jornadas", tags=["jornadas"])


@router.post("/", response_model=JornadaResponse)
def crear_jornada(
    data: JornadaCreate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    return JornadaService.crear(db, data)


@router.get("/", response_model=list[JornadaResponse])
def obtener_jornadas(
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    return JornadaService.obtener_todos(db)


@router.get("/{id_jornada}", response_model=JornadaResponse)
def obtener_jornada(
    id_jornada: int,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    jornada = JornadaService.obtener_por_id(db, id_jornada)

    if not jornada:
        raise HTTPException(status_code=404, detail="Jornada no encontrada")

    return jornada


@router.put("/{id_jornada}", response_model=JornadaResponse)
def actualizar_jornada(
    id_jornada: int,
    data: JornadaUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    jornada = JornadaService.actualizar(db, id_jornada, data)

    if not jornada:
        raise HTTPException(status_code=404, detail="Jornada no encontrada")

    return jornada


@router.delete("/{id_jornada}")
def eliminar_jornada(
    id_jornada: int,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    eliminado = JornadaService.eliminar(db, id_jornada)

    if not eliminado:
        raise HTTPException(status_code=404, detail="Jornada no encontrada")

    return {"mensaje": "Jornada eliminada"}