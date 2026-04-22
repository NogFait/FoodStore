from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from ..core.database import get_session
from .service import create_producto_categoria, list_producto_categorias, delete_producto_categoria

router_producto_categoria = APIRouter(prefix="/productos-categorias", tags=["productos-categorias"])

@router_producto_categoria.post("/")
def create(
    producto_id: int = Query(...), 
    categoria_id: int = Query(...), 
    es_principal: bool = Query(False),
    session: Session = Depends(get_session)
):
    try:
        return create_producto_categoria(session, producto_id, categoria_id, es_principal)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_producto_categoria.get("/")
def list_all(session: Session = Depends(get_session)):
    return list_producto_categorias(session)

@router_producto_categoria.delete("/")
def delete(producto_id: int = Query(...), categoria_id: int = Query(...), session: Session = Depends(get_session)):
    try:
        delete_producto_categoria(session, producto_id, categoria_id)
        return {"message": "Relación eliminada correctamente"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))