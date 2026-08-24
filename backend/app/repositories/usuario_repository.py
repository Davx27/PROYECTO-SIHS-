from uuid import UUID

from sqlalchemy.orm import Session

from app.models.usuario import Usuario


class UsuarioRepository:
    @staticmethod
    def obtener_todos(db: Session):
        return db.query(Usuario).all()

    @staticmethod
    def obtener_por_id(db: Session, id_usuario: UUID):
        return db.query(Usuario).filter(Usuario.idUsuario == id_usuario).first()

    @staticmethod
    def obtener_por_email(db: Session, email: str):
        return db.query(Usuario).filter(Usuario.email == email).first()
