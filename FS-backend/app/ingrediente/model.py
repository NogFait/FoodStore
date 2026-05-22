from typing import Optional, List
from sqlmodel import SQLModel,Field, Relationship
from datetime import datetime
from ..producto_ingrediente.model import ProductoIngrediente

class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    nombre: str
    descripcion: str
    es_alergeno: bool

    producto_ingredientes: List["ProductoIngrediente"] = Relationship(
        back_populates="ingrediente"
    )

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
