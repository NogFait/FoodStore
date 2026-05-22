from typing import TYPE_CHECKING, Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

if TYPE_CHECKING:
    from app.producto.model import Producto
    from app.ingrediente.model import Ingrediente


class ProductoIngrediente(SQLModel, table=True):
    __tablename__ = "productoingrediente"

    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingrediente.id", primary_key=True)

    cantidad: float | None = None
    unidad_medida_id: int | None = Field(foreign_key="unidad_medida.id", default=None)
    es_removible: bool = False
    created_at: datetime = Field(default_factory=datetime.now)

    producto: Optional["Producto"] = Relationship(back_populates="producto_ingredientes")
    ingrediente: Optional["Ingrediente"] = Relationship(back_populates="producto_ingredientes")
