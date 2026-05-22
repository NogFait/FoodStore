from typing import List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship


class UnidadMedida(SQLModel, table=True):
    __tablename__ = "unidad_medida"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=50)
    simbolo: str = Field(max_length=10)
    tipo: str = Field(max_length=20)
    created_at: datetime = Field(default_factory=datetime.now)

    productos: List["Producto"] = Relationship(back_populates="unidad_venta")
