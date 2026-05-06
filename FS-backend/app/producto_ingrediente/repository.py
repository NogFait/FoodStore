from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.producto_ingrediente.model import ProductoIngrediente


class ProductoIngredienteRepository(BaseRepository[ProductoIngrediente]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, ProductoIngrediente)

    def get_by_producto(self, producto_id: int) -> list[ProductoIngrediente]:
        return list(
            self.session.exec(
                select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
            ).all()
        )

    def get_by_ingrediente(self, ingrediente_id: int) -> list[ProductoIngrediente]:
        return list(
            self.session.exec(
                select(ProductoIngrediente).where(ProductoIngrediente.ingrediente_id == ingrediente_id)
            ).all()
        )
