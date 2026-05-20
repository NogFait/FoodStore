from sqlmodel import Session
from app.core.unit_of_work import UnitOfWork
from app.usuarios.repository import UsuarioRepository
from app.usuario_rol.repository import UsuarioRolRepository


class UsuarioUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.usuarios = UsuarioRepository(session)
        self.usuarios_roles = UsuarioRolRepository(session)
