from typing import Optional, List
from sqlmodel import SQLModel,Field, Relationship
from ..producto_categoria.model import ProductoCategoria
from datetime import datetime
from app.core.base_model import BaseModel
from app.producto.model import Producto

class Categoria(BaseModel, table=True):
    parent_id: Optional[int] = Field(foreign_key="categoria.id", default=None)

    nombre: str
    descripcion: str
    imagen_url: Optional[str] = None

    productos: List[Producto] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoria
    )
    