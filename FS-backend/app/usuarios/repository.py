from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.usuarios.model import Usuario
from app.usuario_rol.model import UsuarioRol


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Usuario)

    def get_by_username(self, username: str) -> Usuario | None:
        return self.session.exec(
            select(Usuario).where(Usuario.username == username)
        ).first()

    def get_by_email(self, email: str) -> Usuario | None:
        return self.session.exec(
            select(Usuario).where(Usuario.email == email)
        ).first()

    def get_roles(self, usuario_id: int) -> list[UsuarioRol]:
        return list(self.session.exec(
            select(UsuarioRol).where(UsuarioRol.usuario_id == usuario_id)
        ).all())

    def update(self, usuario: Usuario) -> Usuario:
        self.session.add(usuario)
        self.session.flush()
        self.session.refresh(usuario)
        return usuario
