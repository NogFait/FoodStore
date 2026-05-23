from sqlmodel import SQLModel, Field
from pydantic import EmailStr

from app.usuarios.enums import RolEnum


class UserCreate(SQLModel):
    """Datos requeridos para registrar un usuario."""
    username:  str
    full_name: str
    email:     EmailStr
    password:  str = Field(min_length=8)


class UserPublic(SQLModel):
    """Vista pública del usuario — excluye hashed_password."""
    id:        int
    username:  str
    full_name: str
    email:     str
    rol:       RolEnum
    disabled:  bool


class UserRolUpdate(SQLModel):
    """Payload para que un admin cambie el rol de otro usuario."""
    rol: RolEnum


class Token(SQLModel):
    """Respuesta del endpoint /token."""
    access_token: str
    token_type:   str = "bearer"
    expires_in:   int
