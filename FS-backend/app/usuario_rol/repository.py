from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.usuario_rol.model import UsuarioRol


class UsuarioRolRepository(BaseRepository[UsuarioRol]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, UsuarioRol)

    def get_roles_by_usuario(self, usuario_id: int) -> list[UsuarioRol]:
        return list(self.session.exec(
            select(UsuarioRol).where(UsuarioRol.usuario_id == usuario_id)
        ).all())

    def get_codigos_by_usuario(self, usuario_id: int) -> list[str]:
        rows = self.session.exec(
            select(UsuarioRol.rol_codigo).where(UsuarioRol.usuario_id == usuario_id)
        ).all()
        return list(rows)

    def delete_by_usuario(self, usuario_id: int) -> None:
        for row in self.get_roles_by_usuario(usuario_id):
            self.session.delete(row)
