from datetime import datetime
from sqlmodel import SQLModel, Field


class UsuarioRol(SQLModel, table=True):
    __tablename__ = "usuario_rol"

    usuario_id: int = Field(foreign_key="usuario.id", primary_key=True)
    rol_codigo: str = Field(foreign_key="rol.codigo", primary_key=True)
    asignado_por_id: int | None = Field(foreign_key="usuario.id", default=None)
    expires_at: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.now)
