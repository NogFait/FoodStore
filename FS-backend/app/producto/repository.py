from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.producto.model import Producto
from app.categoria.model import Categoria


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_with_categorias(self, producto_id: int) -> Producto | None:
        producto = self.session.get(Producto, producto_id)
        if producto:
            _ = producto.categorias
            _ = producto.ingredientes
        return producto

    def get_all_with_relations(self, offset: int = 0, limit: int = 20) -> list[Producto]:
        return list(
            self.session.exec(
                select(Producto).offset(offset).limit(limit)
            ).all()
        )

    def get_by_categoria(self, categoria_id: int) -> list[Producto]:
        return list(
            self.session.exec(
                select(Producto)
                .where(Producto.categorias.any(Categoria.id == categoria_id))
            ).all()
        )