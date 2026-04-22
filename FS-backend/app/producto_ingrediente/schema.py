from sqlmodel import SQLModel, Field
from typing import Optional

class ProductoIngredienteBase(SQLModel):
    producto_id: int
    ingrediente_id: int
    es_removible: bool = False

class ProductoIngredienteCreate(ProductoIngredienteBase):
    pass

class ProductoIngredienteUpdate(SQLModel):
    producto_id: Optional[int] = None
    ingrediente_id: Optional[int] = None
    es_removible: Optional[bool] = None