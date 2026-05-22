from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.core.repository import BaseRepository
from app.producto.model import Producto
from app.producto_ingrediente.model import ProductoIngrediente


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_all(self) -> list[Producto]:
        stmt = (
            select(Producto)
            .where(Producto.deleted_at.is_(None))
            .options(selectinload(Producto.producto_ingredientes))
        )
        return list(self.session.exec(stmt).all())

    def get_by_id(self, id: int) -> Producto | None:
        stmt = (
            select(Producto)
            .where(Producto.id == id)
            .options(selectinload(Producto.producto_ingredientes))
        )
        return self.session.exec(stmt).first()
