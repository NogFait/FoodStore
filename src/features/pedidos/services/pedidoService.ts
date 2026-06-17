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

export interface AvanzarEstadoPayload {
  nuevo_estado?: string;
  motivo?: string;
}

export function avanzarEstado(id: number, payload?: AvanzarEstadoPayload) {
  return api
    .patch<PedidoResponse>(`/pedidos/${id}/avanzar`, payload ?? {})
    .then((r) => r.data);
}

export function cancelarPedido(id: number, motivo: string) {
  return api
    .delete<PedidoResponse>(`/pedidos/${id}`, { data: { motivo } })
    .then((r) => r.data);
}
