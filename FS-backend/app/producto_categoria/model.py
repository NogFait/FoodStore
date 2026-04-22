from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class ProductoCategoria(SQLModel, table=True):
    
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True)

    es_principal: bool = False
    created_at: datetime = Field(default_factory=datetime.now)