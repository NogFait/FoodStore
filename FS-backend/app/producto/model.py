from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

from app.categoria.model import Categoria
from app.ingrediente.model import Ingrediente
from ..producto_categoria.model import ProductoCategoria
from ..producto_ingrediente.model import ProductoIngrediente
from datetime import datetime

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    nombre: str
    descripcion: str
    precio_base: float = Field(ge=0)
    imagenes_url: Optional[str] = None
    stock_cantidad: int = Field(default=0, ge=0)
    disponible: bool = True
    unidad_venta_id: Optional[int] = Field(foreign_key="unidad_medida.id", default=None)

    categorias: List["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoria
    )

    ingredientes: List["Ingrediente"] = Relationship(
        back_populates="productos",
        link_model=ProductoIngrediente
    )

    unidad_venta: Optional["UnidadMedida"] = Relationship(back_populates="productos")

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None



    @property
    def categorias_ids(self) -> List[int]:
        return [cat.id for cat in self.categorias] if self.categorias else []

    @property
    def ingredientes_ids(self) -> List[int]:
        return [ing.id for ing in self.ingredientes] if self.ingredientes else []