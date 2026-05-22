import api from "../../../api/api";
import type { Direccion } from "../types";

export function getDirecciones(params?: Record<string, string | number | boolean | undefined>) {
  return api.get<Direccion[]>("/direcciones/", { params }).then((r) => r.data);
}

export function getDireccionById(id: number): Promise<Direccion> {
  return api.get<Direccion>(`/direcciones/${id}`).then((r) => r.data);
}

export function createDireccion(data: Omit<Direccion, "id" | "usuario_id">): Promise<Direccion> {
  return api.post<Direccion>("/direcciones/", data).then((r) => r.data);
}

export function updateDireccion(id: number, data: Partial<Direccion>): Promise<Direccion> {
  return api.patch<Direccion>(`/direcciones/${id}`, data).then((r) => r.data);
}

export function deleteDireccion(id: number): Promise<void> {
  return api.delete(`/direcciones/${id}`);
}
