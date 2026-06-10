import api from "../../../api/api";
import type { UnidadMedida } from "../types";

export function getUnidadesMedida(params?: Record<string, string | number | boolean | undefined>) {
  return api.get<UnidadMedida[]>("/unidades-medida/", { params }).then((r) => r.data);
}

export function getUnidadMedidaById(id: number): Promise<UnidadMedida> {
  return api.get<UnidadMedida>(`/unidades-medida/${id}`).then((r) => r.data);
}

export function createUnidadMedida(data: Omit<UnidadMedida, "id">): Promise<UnidadMedida> {
  return api.post<UnidadMedida>("/unidades-medida/", data).then((r) => r.data);
}

export function updateUnidadMedida(id: number, data: Partial<UnidadMedida>): Promise<UnidadMedida> {
  return api.patch<UnidadMedida>(`/unidades-medida/${id}`, data).then((r) => r.data);
}

export function deleteUnidadMedida(id: number): Promise<void> {
  return api.delete(`/unidades-medida/${id}`);
}
