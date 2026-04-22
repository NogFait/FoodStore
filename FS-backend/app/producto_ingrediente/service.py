from sqlmodel import Session, select
from .model import ProductoIngrediente

def create_ingrediente_producto(session: Session, producto_id: int, ingrediente_id: int, es_removible: bool = False) -> ProductoIngrediente:
    pi = ProductoIngrediente(producto_id=producto_id, ingrediente_id=ingrediente_id, es_removible=es_removible)

    session.add(pi)
    session.commit()
    session.refresh(pi)

    return pi

def list_producto_ingrediente(session: Session) -> list[ProductoIngrediente]:
    statement = select(ProductoIngrediente)
    result = session.exec(statement)
    return result.all()

def delete_producto_ingrediente(session: Session, producto_id:int, ingrediente_id:int) -> bool:
    statement = select(ProductoIngrediente).where(
        ProductoIngrediente.producto_id == producto_id,
        ProductoIngrediente.ingrediente_id == ingrediente_id
    )
    pi = session.exec(statement).one_or_none()
    if not pi:
        raise ValueError("Relación producto-ingrediente no encontrada")
    session.delete(pi)
    session.commit()
    return True