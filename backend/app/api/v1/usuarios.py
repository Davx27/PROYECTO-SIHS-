from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.supabase_auth import get_current_user, require_admin
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioResponse
from app.services.usuario_service import UsuarioService

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.get("/me", response_model=UsuarioResponse)
def obtener_mi_perfil(usuario: Usuario = Depends(get_current_user)):
    """Perfil del usuario autenticado — confirma que Supabase Auth + la
    base de datos están conectados end-to-end."""
    return usuario


@router.get("/", response_model=list[UsuarioResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    return UsuarioService.listar_usuarios(db)


@router.get("/{id_usuario}", response_model=UsuarioResponse)
def obtener_usuario(
    id_usuario: UUID,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    encontrado = UsuarioService.obtener_por_id(db, id_usuario)

    if not encontrado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return encontrado
