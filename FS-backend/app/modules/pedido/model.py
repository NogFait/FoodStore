from typing import Optional, List
from sqlmodel import  Field, Relationship
from app.core.base_model import BaseEntity





class Pedido(BaseEntity, table=True):

    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    direccion_id: int = Field(foreign_key="direccionentrega.id", index=True)
    total: float
    estado: str = Field(max_length=20)

    items: List["ItemPedido"] = Relationship(back_populates="pedido")
    direccion: "DireccionEntrega" = Relationship(back_populates="pedidos")


