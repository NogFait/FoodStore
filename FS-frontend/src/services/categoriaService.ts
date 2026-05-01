import { fetchApi, type QueryParams } from "../api/api";
import type { Categoria } from "../types/categoria";

export function getCategorias(params?: QueryParams): Promise<Categoria[]> {
  return fetchApi<Categoria[]>("/categorias/", params);
}

export function getCategoriaById(id: number): Promise<Categoria> {
  return fetchApi<Categoria>(`/categorias/${id}`);
}

export function createCategoria(data: Omit<Categoria, "id">): Promise<Categoria> {
  return fetchApi<Categoria>("/categorias/", { method: "POST", body: JSON.stringify(data) });
}

export function updateCategoria(id: number, data: Omit<Categoria, "id">): Promise<Categoria> {
  return fetchApi<Categoria>(`/categorias/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteCategoria(id: number): Promise<void> {
  return fetchApi<void>(`/categorias/${id}`, { method: "DELETE" });
}
