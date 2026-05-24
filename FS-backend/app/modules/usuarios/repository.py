from sqlmodel import Session, select, col
from app.core.repository import BaseRepository
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.enums import RolEnum


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Usuario)

    def get_by_username(self, username: str) -> Usuario | None:
        return self.session.exec(
            select(Usuario)
            .where(Usuario.username == username)
            .where(col(Usuario.deleted_at).is_(None))
        ).first()

    def get_by_email(self, email: str) -> Usuario | None:
        return self.session.exec(
            select(Usuario)
            .where(Usuario.email == email)
            .where(col(Usuario.deleted_at).is_(None))
        ).first()

    def get_by_rol(self, rol: RolEnum) -> list[Usuario]:
        return list(
            self.session.exec(
                select(Usuario)
                .where(Usuario.rol == rol)
                .where(col(Usuario.deleted_at).is_(None))
            ).all()
        )
