import token
from typing import List
from sqlmodel import SQLModel, Field, Relationship

from app.usuarios.enums import RolEnum
from app.direccion.model import DireccionEntrega
from app.refresh_token.model import RefreshToken
from app.core.base_model import BaseEntity


class Usuario(BaseEntity, table=True):
    username:        str        = Field(index=True, unique=True)
    full_name:       str
    email:           str        = Field(index=True, unique=True)
    hashed_password: str
    disabled:        bool       = Field(default=False)
    rol:             RolEnum    = Field(default=RolEnum.CLIENTE, index=True)
    token_version:    int        = Field(default=0)

    direcciones: List["DireccionEntrega"] = Relationship(back_populates="usuario")

    refresh_tokens: List["RefreshToken"] = Relationship(back_populates="usuario")
