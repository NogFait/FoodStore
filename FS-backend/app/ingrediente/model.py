from typing import Optional, List
from sqlmodel import SQLModel,Field, Relationship
from datetime import datetime
from ..producto_ingrediente.model import ProductoIngrediente
from app.core.base_model import BaseEntity

class Ingrediente(BaseEntity, table=True):

    nombre: str
    descripcion: str
    es_alergeno: bool

    producto_ingredientes: List["ProductoIngrediente"] = Relationship(
        back_populates="ingrediente"
    )
