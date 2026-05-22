from typing import Optional
from fastapi import HTTPException
from sqlmodel import Session, select

from app.producto.model import Producto
from app.producto.schema import ProductoCreate, ProductoUpdate, ProductoResponse
from app.producto.unit_of_work import ProductoUnitOfWork
from app.categoria.model import Categoria
from app.ingrediente.model import Ingrediente
from datetime import datetime
