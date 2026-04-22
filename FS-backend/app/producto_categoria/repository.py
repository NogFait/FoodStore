from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.producto_categoria.model import ProductoCategoria


class ProductoCategoriaRepository(BaseRepository[ProductoCategoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, ProductoCategoria)

    def get_by_producto_and_categoria(self, producto_id: int, categoria_id: int) -> ProductoCategoria | None:
        return self.session.exec(
            select(ProductoCategoria).where(
                ProductoCategoria.producto_id == producto_id,
                ProductoCategoria.categoria_id == categoria_id
            )
        ).one_or_none()

    def get_by_producto(self, producto_id: int) -> list[ProductoCategoria]:
        return list(
            self.session.exec(
                select(ProductoCategoria).where(
                    ProductoCategoria.producto_id == producto_id
                )
            ).all()
        )