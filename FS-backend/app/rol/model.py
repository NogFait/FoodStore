from typing import List
from sqlmodel import SQLModel, Field, Relationship

from app.usuario_rol.model import UsuarioRol


class Rol(SQLModel, table=True):
    __tablename__ = "rol"

    codigo: str = Field(primary_key=True, max_length=20)
    nombre: str = Field(max_length=50)
    descripcion: str | None = Field(default=None)

    usuarios: List["Usuario"] = Relationship(
        back_populates="roles",
        link_model=UsuarioRol,
        sa_relationship_kwargs={
            "primaryjoin": "Rol.codigo == UsuarioRol.rol_codigo",
            "secondaryjoin": "UsuarioRol.usuario_id == Usuario.id",
        },
    )
