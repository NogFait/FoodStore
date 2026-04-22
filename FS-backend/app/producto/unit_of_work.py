from sqlmodel import Session
from app.core.unit_of_work import UnitOfWork
from app.producto.repository import ProductoRepository
from app.categoria.repository import CategoriaRepository
from app.producto_ingrediente.repository import ProductoIngredienteRepository
from app.producto_categoria.repository import ProductoCategoriaRepository


class ProductoUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.productos = ProductoRepository(session)
        self.categorias = CategoriaRepository(session)
        self.producto_ingrediente = ProductoIngredienteRepository(session)
        self.producto_categoria = ProductoCategoriaRepository(session)