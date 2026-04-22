from typing import Optional
from fastapi import HTTPException
from sqlmodel import Session, select

from app.producto.model import Producto
from app.producto.schema import ProductoCreate, ProductoUpdate, ProductoResponse
from app.producto.unit_of_work import ProductoUnitOfWork
from app.categoria.model import Categoria
from datetime import datetime


class ProductoService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def _get_or_404(self, uow: ProductoUnitOfWork, producto_id: int) -> Producto:
        producto = uow.productos.get_by_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return producto

    def create(self, data: ProductoCreate) -> Producto:
        with ProductoUnitOfWork(self._session) as uow:
            producto = Producto.model_validate(data)

            if producto.stock_cantidad == 0:
                producto.disponible = False
            elif producto.stock_cantidad > 0:
                producto.disponible = True

            if hasattr(data, "categorias_ids") and data.categorias_ids:
                categorias = list(
                    uow.session.exec(
                        select(Categoria).where(Categoria.id.in_(data.categorias_ids))
                    ).all()
                )
                producto.categorias = categorias

            uow.productos.add(producto)
            return ProductoResponse.model_validate(producto)

    def get_by_id(self, producto_id: int) -> Producto:
        with ProductoUnitOfWork(self._session) as uow:
            producto = self._get_or_404(uow, producto_id)
            return producto

    def list(self, skip: int = 0, limit: int = 20, disponible: Optional[bool] = None) -> list[Producto]:
        with ProductoUnitOfWork(self._session) as uow:
            productos = uow.productos.get_all()
            
            if disponible is not None:
                productos = [p for p in productos if p.disponible == disponible]
            
            return list(productos)[skip : skip + limit]

    def update(self, producto_id: int, data: ProductoUpdate) -> Producto:
        with ProductoUnitOfWork(self._session) as uow:
            producto = self._get_or_404(uow, producto_id)

            update_data = data.model_dump(exclude_unset=True)

            if "categorias_ids" in update_data:
                categorias_ids = update_data.pop("categorias_ids")
                if categorias_ids is not None:
                    from app.categoria.model import Categoria
                    categorias = list(
                        uow.session.exec(
                            select(Categoria).where(Categoria.id.in_(categorias_ids))
                        ).all()
                    )
                    producto.categorias = categorias

            for field, value in update_data.items():
                setattr(producto, field, value)

            if producto.stock_cantidad == 0:
                producto.disponible = False
            elif producto.stock_cantidad > 0:
                producto.disponible = True

            producto.updated_at = datetime.now()

            uow.productos.add(producto)
            return producto

    def delete(self, producto_id: int) -> bool:
        with ProductoUnitOfWork(self._session) as uow:
            producto = self._get_or_404(uow, producto_id)
            uow.productos.delete(producto)
            return True


def create_producto(session: Session, data: ProductoCreate) -> Producto:
    service = ProductoService(session)
    return service.create(data)


def get_producto_by_id(session: Session, producto_id: int) -> Producto:
    service = ProductoService(session)
    return service.get_by_id(producto_id)


def list_productos(
    session: Session,
    skip: int = 0,
    limit: int = 20,
    disponible: Optional[bool] = None,
) -> list[Producto]:
    service = ProductoService(session)
    return service.list(skip=skip, limit=limit, disponible=disponible)


def update_producto(session: Session, producto_id: int, data: ProductoUpdate) -> Producto:
    service = ProductoService(session)
    return service.update(producto_id, data)


def delete_producto(session: Session, producto_id: int) -> bool:
    service = ProductoService(session)
    return service.delete(producto_id)