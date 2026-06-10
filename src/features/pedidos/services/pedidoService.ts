import api from "../../../api/api";
import type { PedidoResponse, PedidoResumen } from "../types";

type ListParams = {
  offset?: number;
  limit?: number;
  estado_codigo?: string;
};

export function getPedidos(params?: ListParams) {
  return api.get<PedidoResumen[]>("/pedidos/", { params }).then((r) => r.data);
}

export function getPedidoById(id: number) {
  return api.get<PedidoResponse>(`/pedidos/${id}`).then((r) => r.data);
}

export function avanzarEstado(id: number) {
  return api.patch<PedidoResponse>(`/pedidos/${id}/avanzar`).then((r) => r.data);
}

export function cancelarPedido(id: number) {
  return api.patch<PedidoResponse>(`/pedidos/${id}/cancelar`).then((r) => r.data);
}
