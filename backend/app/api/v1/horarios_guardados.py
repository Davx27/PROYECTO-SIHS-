from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.supabase_auth import get_current_user
from app.schemas.horario_guardado import HorarioGuardadoCreate, HorarioGuardadoResponse
from app.services.horario_guardado_service import HorarioGuardadoService

router = APIRouter(prefix="/horarios-guardados", tags=["horarios-guardados"])


def _con_creador(horario_guardado):
    horario_guardado.creadorNombre = horario_guardado.usuario.nombre if horario_guardado.usuario else None
    return horario_guardado


@router.post("/", response_model=HorarioGuardadoResponse)
def crear_horario_guardado(
    data: HorarioGuardadoCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user),
):
    return _con_creador(HorarioGuardadoService.crear(db, data, usuario))


@router.get("/", response_model=list[HorarioGuardadoResponse])
def obtener_horarios_guardados(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user),
):
    return [_con_creador(h) for h in HorarioGuardadoService.obtener_todos(db)]


@router.get("/{id_horario_guardado}", response_model=HorarioGuardadoResponse)
def obtener_horario_guardado(
    id_horario_guardado: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user),
):
    horario_guardado = HorarioGuardadoService.obtener_por_id(db, id_horario_guardado)

    if not horario_guardado:
        raise HTTPException(status_code=404, detail="Horario guardado no encontrado")

    return _con_creador(horario_guardado)
