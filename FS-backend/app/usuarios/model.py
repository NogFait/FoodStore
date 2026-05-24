from typing import TYPE_CHECKING,List
from sqlmodel import Field, Relationship


from app.usuarios.enums import RolEnum

from app.core.base_model import BaseEntity

if TYPE_CHECKING:
    from app.direccion.model import DireccionEntrega
    from app.refresh_token.model import RefreshToken

class Usuario(BaseEntity, table=True):
    __tablename__ = "usuario" # type: ignore[assignment]

    username:        str        = Field(index=True, unique=True)
    full_name:       str
    email:           str        = Field(index=True, unique=True)
    hashed_password: str
    disabled:        bool       = Field(default=False)
    rol:             RolEnum    = Field(default=RolEnum.CLIENTE, index=True)
    token_version:    int        = Field(default=0)

    direcciones: List["DireccionEntrega"] = Relationship(back_populates="usuario")

    refresh_tokens: List["RefreshToken"] = Relationship(back_populates="usuario")
