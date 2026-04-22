from sqlmodel import SQLModel, Field
from typing import Optional

class ProductoCategoriaBase(SQLModel):
    producto_id: int
    categoria_id: int
    es_principal: bool = False

class ProductoCategoriaCreate(ProductoCategoriaBase):
    pass

class ProductoCategoriaUpdate(SQLModel):
    producto_id: Optional[int] = None
    categoria_id: Optional[int] = None
    es_principal: Optional[bool] = None