from typing import Optional, List
from sqlmodel import SQLModel,Field, Relationship
from ..producto_categoria.model import ProductoCategoria
from datetime import datetime

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    nombre: str
    descripcion: str
    imagen_url: Optional[str] = None

    productos: List["Producto"] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoria
    )
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None