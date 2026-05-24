from typing import Optional
from fastapi import HTTPException
from sqlmodel import Session, select

from app.modules.producto.model import Producto
from app.modules.producto.schema import ProductoCreate, ProductoUpdate, ProductoResponse
from app.modules.producto.unit_of_work import ProductoUnitOfWork
from app.modules.categoria.model import Categoria
from app.modules.ingrediente.model import Ingrediente
from datetime import datetime
