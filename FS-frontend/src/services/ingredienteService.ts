import { fetchApi, type QueryParams } from "../api/api";
import type { Ingrediente } from "../types/ingrediente";

export function getIngredientes(params?: QueryParams): Promise<Ingrediente[]> {
  return fetchApi<Ingrediente[]>("/ingredientes/", params);
}

export function getIngredienteById(id: number): Promise<Ingrediente> {
  return fetchApi<Ingrediente>(`/ingredientes/${id}`);
}

export function createIngrediente(data: Omit<Ingrediente, "id">): Promise<Ingrediente> {
  return fetchApi<Ingrediente>("/ingredientes/", { method: "POST", body: JSON.stringify(data) });
}

export function updateIngrediente(id: number, data: Omit<Ingrediente, "id">): Promise<Ingrediente> {
  return fetchApi<Ingrediente>(`/ingredientes/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteIngrediente(id: number): Promise<void> {
  return fetchApi<void>(`/ingredientes/${id}`, { method: "DELETE" });
}
