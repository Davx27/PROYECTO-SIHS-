from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.horarios import _a_response
from app.core.database import get_db
from app.core.supabase_auth import require_roles
from app.schemas.horario import HorarioResponse
from app.services.horario_service import HorarioService
from app.services.usuario_service import UsuarioService

router = APIRouter(prefix="/instructores", tags=["instructores"])

require_consulta_horarios = require_roles("Coordinador", "Administrador")


@router.get("/{id_instructor}/horarios", response_model=list[HorarioResponse])
def obtener_horarios_instructor(
    id_instructor: UUID,
    db: Session = Depends(get_db),
    usuario=Depends(require_consulta_horarios),
):
    instructor = UsuarioService.obtener_por_id(db, id_instructor)

    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor no encontrado")

    return [
        _a_response(db, horario)
        for horario in HorarioService.obtener_por_instructor(db, id_instructor)
    ]