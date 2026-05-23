from typing import List
from datetime import datetime
from sqlmodel import  Field, Relationship
from app.core.base_model import BaseEntity
from app.producto.model import Producto
class UnidadMedida(BaseEntity, table=True):

    nombre: str = Field(max_length=50)
    simbolo: str = Field(max_length=10)
    tipo: str = Field(max_length=20)

    productos: List["Producto"] = Relationship(back_populates="unidad_venta")
