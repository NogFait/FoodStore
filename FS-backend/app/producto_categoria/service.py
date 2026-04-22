from sqlmodel import Session, select
from .model import ProductoCategoria

def create_producto_categoria(session: Session, producto_id: int, categoria_id: int, es_principal: bool = False) -> ProductoCategoria:
    pc = ProductoCategoria(producto_id=producto_id, categoria_id=categoria_id, es_principal=es_principal)
    session.add(pc)
    session.commit()
    session.refresh(pc)
    return pc

def list_producto_categorias(session: Session) -> list[ProductoCategoria]:
    statement = select(ProductoCategoria)
    result = session.exec(statement)
    return result.all()

def delete_producto_categoria(session: Session, producto_id: int, categoria_id: int) -> bool:
    statement = select(ProductoCategoria).where(
        ProductoCategoria.producto_id == producto_id,
        ProductoCategoria.categoria_id == categoria_id
    )
    pc = session.exec(statement).one_or_none()
    if not pc:
        raise ValueError("Relación producto-categoría no encontrada")
    session.delete(pc)
    session.commit()
    return True