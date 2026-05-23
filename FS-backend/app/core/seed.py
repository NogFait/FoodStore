"""
Seeds idempotentes que corren al arrancar la app.

Idempotencia = correr la función N veces produce el mismo resultado que correrla 1 vez.
Si el admin ya existe → no hace nada. Si no existe → lo crea.
"""

from sqlmodel import Session
from app.core.config import settings
from app.core.security import hash_password
from app.usuarios.enums import RolEnum
from app.usuarios.model import Usuario
from app.usuarios.unit_of_work import UsuarioUnitOfWork


def seed_admin_user(session: Session) -> None:
    """Crea el usuario admin inicial si no hay ningún usuario con rol ADMIN."""
    with UsuarioUnitOfWork(session) as uow:
        existentes = uow.usuarios.get_by_rol(RolEnum.ADMIN)
        if existentes:
            return

        admin = Usuario(
            username=settings.ADMIN_INITIAL_USERNAME,
            full_name=settings.ADMIN_INITIAL_FULLNAME,
            email=settings.ADMIN_INITIAL_EMAIL,
            hashed_password=hash_password(settings.ADMIN_INITIAL_PASSWORD),
            rol=RolEnum.ADMIN,
            disabled=False,
        )
        uow.usuarios.add(admin)
