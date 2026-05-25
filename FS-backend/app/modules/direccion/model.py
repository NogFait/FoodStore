from typing import Optional, TYPE_CHECKING
from sqlmodel import  Field, Relationship
from app.core.base_model import BaseEntity

if TYPE_CHECKING:
    from app.modules.usuarios.model import Usuario


class DireccionEntrega(BaseEntity, table=True):
    __tablename__ = "direccion_entrega" #type: ignore
    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    alias: str = Field(max_length=50)
    linea1: str
    linea2: Optional[str] = None
    ciudad: str = Field(max_length=100)
    provincia: str = Field(max_length=100)
    codigo_postal: str = Field(max_length=10)
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    es_principal: bool = False

    usuario: "Usuario" = Relationship(back_populates="direcciones")