from sqlmodel import Session
from app.core.unit_of_work import UnitOfWork
from app.modules.producto.repository import ProductoRepository
from app.modules.categoria.repository import CategoriaRepository
from app.modules.producto_ingrediente.repository import ProductoIngredienteRepository
from app.modules.producto_categoria.repository import ProductoCategoriaRepository

