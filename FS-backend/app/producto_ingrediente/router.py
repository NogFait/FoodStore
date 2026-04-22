from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from ..core.database import get_session
from .service import create_ingrediente_producto, list_producto_ingrediente, delete_producto_ingrediente


router_producto_ingrediente = APIRouter(prefix="/productos-ingredientes", tags=["producto-ingredientes"])

@router_producto_ingrediente.post("/")
def create(
    producto_id: int = Query(...),
    ingrediente_id: int = Query(...),
    es_removible: bool = Query(False),
    session: Session = Depends(get_session)
):
    try:
        return create_ingrediente_producto(session, producto_id, ingrediente_id, es_removible)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router_producto_ingrediente.get("/")
def list_all(session: Session = Depends(get_session)):
    return list_producto_ingrediente(session)

@router_producto_ingrediente.delete("/")
def delete(producto_id: int = Query(...), ingrediente_id: int = Query(...),session: Session = Depends(get_session)):
    try:
        delete_producto_ingrediente(session, producto_id, ingrediente_id)
        return {"message": "Relación eliminada correctamente"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))