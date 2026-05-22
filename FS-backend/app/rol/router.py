from typing import Annotated
from fastapi import APIRouter, Depends, Path, Query, status
from sqlmodel import Session
from app.core.database import get_session
from app.core.deps import get_current_active_user, require_role
from app.rol.schema import RolCreate, RolResponse, RolUpdate
from app.rol.service import create_rol, list_roles, get_rol, update_rol, delete_rol


router_rol = APIRouter(prefix="/roles", tags=["roles"])

@router_rol.get("/", response_model=list[RolResponse])
def list_all(
    session: Session = Depends(get_session),
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_roles(session, skip=skip, limit=limit)

@router_rol.get("/{codigo}", response_model=RolResponse)
def get_by_codigo(
    codigo: Annotated[str, Path(max_length=20)],
    session: Session = Depends(get_session),
):
    return get_rol(session, codigo)

@router_rol.post("/", response_model=RolResponse, status_code=status.HTTP_201_CREATED)
def create(
    data: RolCreate,
    session: Session = Depends(get_session),
):
    return create_rol(session, data)

@router_rol.patch("/{codigo}", response_model=RolResponse)
def update(
    codigo: Annotated[str, Path(max_length=20)],
    data: RolUpdate,
    session: Session = Depends(get_session),
):
    return update_rol(session, codigo, data)

@router_rol.delete("/{codigo}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    codigo: Annotated[str, Path(max_length=20)],
    session: Session = Depends(get_session),
):
    return delete_rol(session, codigo)