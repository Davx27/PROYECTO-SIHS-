from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.supabase_auth import require_admin
from app.schemas.guia import GuiaCreate, GuiaResponse, GuiaUpdate
from app.services.guia_service import GuiaService

router = APIRouter(prefix="/guias", tags=["guias"])


@router.post("/", response_model=GuiaResponse)
def crear_guia(
    data: GuiaCreate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    return GuiaService.crear(db, data)


@router.get("/", response_model=list[GuiaResponse])
def obtener_guias(
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    return GuiaService.obtener_todos(db)


@router.get("/{id_guia}", response_model=GuiaResponse)
def obtener_guia(
    id_guia: int,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    guia = GuiaService.obtener_por_id(db, id_guia)

    if not guia:
        raise HTTPException(status_code=404, detail="Guía no encontrada")

    return guia


@router.put("/{id_guia}", response_model=GuiaResponse)
def actualizar_guia(
    id_guia: int,
    data: GuiaUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    guia = GuiaService.actualizar(db, id_guia, data)

    if not guia:
        raise HTTPException(status_code=404, detail="Guía no encontrada")

    return guia


@router.delete("/{id_guia}")
def eliminar_guia(
    id_guia: int,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    eliminado = GuiaService.eliminar(db, id_guia)

    if not eliminado:
        raise HTTPException(status_code=404, detail="Guía no encontrada")

    return {"mensaje": "Guía eliminada"}
