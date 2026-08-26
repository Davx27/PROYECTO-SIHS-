from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.supabase_auth import require_admin
from app.schemas.ambiente import AmbienteCreate, AmbienteResponse, AmbienteUpdate
from app.services.ambiente_service import AmbienteService

router = APIRouter(prefix="/ambientes", tags=["ambientes"])
service = AmbienteService()


@router.get("", response_model=list[AmbienteResponse])
def list_ambientes(sede_id: int | None = None, db: Session = Depends(get_db), usuario=Depends(require_admin)):
    return service.list(db, sede_id)


@router.get("/{ambiente_id}", response_model=AmbienteResponse)
def get_ambiente(ambiente_id: int, db: Session = Depends(get_db), usuario=Depends(require_admin)):
    return service.get(db, ambiente_id)


@router.post("", response_model=AmbienteResponse, status_code=status.HTTP_201_CREATED)
def create_ambiente(data: AmbienteCreate, db: Session = Depends(get_db), usuario=Depends(require_admin)):
    return service.create(db, data)


@router.put("/{ambiente_id}", response_model=AmbienteResponse)
def update_ambiente(ambiente_id: int, data: AmbienteUpdate, db: Session = Depends(get_db), usuario=Depends(require_admin)):
    return service.update(db, ambiente_id, data)


@router.delete("/{ambiente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ambiente(ambiente_id: int, db: Session = Depends(get_db), usuario=Depends(require_admin)) -> Response:
    service.delete(db, ambiente_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
