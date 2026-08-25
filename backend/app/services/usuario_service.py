from uuid import UUID

from app.repositories.usuario_repository import UsuarioRepository


class UsuarioService:
    @staticmethod
    def listar_usuarios(db):
        return UsuarioRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(db, id_usuario: UUID):
        return UsuarioRepository.obtener_por_id(db, id_usuario)
