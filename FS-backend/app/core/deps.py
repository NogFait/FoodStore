from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.core.unit_of_work import UnitOfWork, get_uow
from app.usuarios.model import Usuario
from app.usuarios.schema import UserPublic

from fastapi import Request


class OAuth2PasswordBearerWithCookie(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> str | None:
        token = request.cookies.get("access_token")

        if not token:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="No autenticado",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None
        return token


oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/api/v1/auth/token")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas o token expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username: str | None = payload.get("sub")
    if username is None:
        raise credentials_exception

    with uow:
        user = uow.usuarios.get_by_username(username)
        if user is None:
            raise credentials_exception

        return UserPublic.model_validate(user)


async def get_current_active_user(
    current_user: Annotated[Usuario, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )

    return UserPublic.model_validate(current_user)


def require_role(allowed_roles: list[str]):
    async def role_checker(
        current_user: Annotated[Usuario, Depends(get_current_active_user)],
        uow: Annotated[UnitOfWork, Depends(get_uow)],
    ) -> Usuario:
        with uow:
            user_roles = uow.usuarios.get_roles(current_user.id)
            role_codes = [ur.rol_codigo for ur in user_roles]
            if not any(r in allowed_roles for r in role_codes):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=(
                        f"Permisos insuficientes. Tus roles son {role_codes}. "
                        f"Se requiere uno de: {allowed_roles}"
                    ),
                )
        return current_user

    return role_checker
