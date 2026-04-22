from typing import Optional, List
from sqlmodel import SQLModel,Field, Relationship
from datetime import datetime
from ..producto_ingrediente.model import ProductoIngrediente

class Ingrediente(SQLModel, table=True):
    #ID generado por la base de datos
    id: Optional[int] = Field(default=None, primary_key=True)

    nombre: str
    descripcion: str
    es_alergeno: bool

    productos: List["Producto"] = Relationship(
        back_populates = "ingredientes",
        link_model= ProductoIngrediente
    )

    #CAMPOS DE AUDITORÍA
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None