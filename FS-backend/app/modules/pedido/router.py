from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Path, Query, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.deps import get_current_active_user, require_role
from app.modules.rol.enums import RolEnum
from app.modules.usuarios.schema import UserPublic

from .schema import PedidoCreate, PedidoResponse, PedidoResumen
from .service import PedidoService


router_pedido = APIRouter(prefix="/api/v1/pedidos", tags=["pedidos"])


# ============================================================
# Cliente — crear / ver lo propio
# ============================================================

@router_pedido.post(
    "/",
    response_model=PedidoResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(
    data: PedidoCreate,
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    session: Session = Depends(get_session),
):
    """Crea un pedido a partir del carrito del cliente logueado."""
    return PedidoService(session).crear_desde_carrito(data, usuario)


@router_pedido.get(
    "/mios",
    response_model=list[PedidoResumen],
)
def listar_mis_pedidos(
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    session: Session = Depends(get_session),
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    """Lista los pedidos del usuario logueado, paginado."""
    return PedidoService(session).list_mis_pedidos(usuario, offset, limit)


# ============================================================
# Cliente o Admin/Cocina — detalle y cancelación
# ============================================================

@router_pedido.get(
    "/{pedido_id}",
    response_model=PedidoResponse,
)
def obtener_pedido(
    pedido_id: Annotated[int, Path(ge=1)],
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    session: Session = Depends(get_session),
):
    """Detalle de un pedido. El cliente solo ve los suyos; admin/cocina ven cualquiera."""
    return PedidoService(session).get_pedido(pedido_id, usuario)


@router_pedido.patch(
    "/{pedido_id}/cancelar",
    response_model=PedidoResponse,
)
def cancelar_pedido(
    pedido_id: Annotated[int, Path(ge=1)],
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    session: Session = Depends(get_session),
):
    """Cancela un pedido si el estado actual lo permite. Dueño o admin/cocina."""
    return PedidoService(session).cancelar(pedido_id, usuario)


# ============================================================
# Admin / Cocina — listado total y avance de estado
# ============================================================

@router_pedido.get(
    "/",
    response_model=list[PedidoResumen],
    dependencies=[Depends(require_role([RolEnum.ADMIN, RolEnum.COCINA]))],
)
def listar_todos(
    session: Session = Depends(get_session),
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    estado_codigo: Annotated[
        Optional[str], Query(description="Filtrar por código de estado")
    ] = None,
):
    """Vista operativa — admin/cocina ven todos los pedidos con filtro opcional por estado."""
    return PedidoService(session).list_todos(offset, limit, estado_codigo)


@router_pedido.patch(
    "/{pedido_id}/avanzar",
    response_model=PedidoResponse,
)
def avanzar_estado(
    pedido_id: Annotated[int, Path(ge=1)],
    usuario: Annotated[
        UserPublic,
        Depends(require_role([RolEnum.ADMIN, RolEnum.COCINA])),
    ],
    session: Session = Depends(get_session),
):
    """Avanza el pedido al siguiente estado por orden ascendente."""
    return PedidoService(session).avanzar_estado(pedido_id, usuario)
