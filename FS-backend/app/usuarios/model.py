from typing import List
from sqlmodel import SQLModel, Field, Relationship

from app.usuario_rol.model import UsuarioRol
from app.direccion.model import DireccionEntrega
from app.refresh_token.model import RefreshToken

class Usuario(SQLModel, table=True):
    id:              int | None = Field(default=None, primary_key=True)
    username:        str        = Field(index=True, unique=True)
    full_name:       str
    email:           str        = Field(index=True, unique=True)
    hashed_password: str
    disabled:        bool       = Field(default=False)

    roles: List["Rol"] = Relationship(
        back_populates="usuarios",
        link_model=UsuarioRol,
    )

    direcciones: List["DireccionEntrega"] = Relationship(back_populates="usuario")

    refresh_tokens: List["RefreshToken"] = Relationship(back_populates="usuario")
