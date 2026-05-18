import api from "../../../api/api";
import type { Ingrediente } from "../../../types/ingrediente";

export function getIngredientes(params?: Record<string, string | number | boolean | undefined>) {
  return api.get<Ingrediente[]>("/ingredientes/", { params }).then((r) => r.data);
}

export function getIngredienteById(id: number): Promise<Ingrediente> {
  return api.get<Ingrediente>(`/ingredientes/${id}`).then((r) => r.data);
}

export function createIngrediente(data: Omit<Ingrediente, "id">): Promise<Ingrediente> {
  return api.post<Ingrediente>("/ingredientes/", data).then((r) => r.data);
}

export function updateIngrediente(id: number, data: Partial<Ingrediente>): Promise<Ingrediente> {
  return api.patch<Ingrediente>(`/ingredientes/${id}`, data).then((r) => r.data);
}

export function deleteIngrediente(id: number): Promise<void> {
  return api.delete(`/ingredientes/${id}`);
}
