import api from "../../../api/api";
import type { Categoria } from "../types";

export function getCategorias(params?: Record<string, string | number | boolean | undefined>) {
  return api.get<Categoria[]>("/categorias/", { params }).then((r) => r.data);
}

export function getCategoriaById(id: number): Promise<Categoria> {
  return api.get<Categoria>(`/categorias/${id}`).then((r) => r.data);
}

export function createCategoria(data: Omit<Categoria, "id">): Promise<Categoria> {
  return api.post<Categoria>("/categorias/", data).then((r) => r.data);
}

export function updateCategoria(id: number, data: Partial<Categoria>): Promise<Categoria> {
  return api.patch<Categoria>(`/categorias/${id}`, data).then((r) => r.data);
}

export function deleteCategoria(id: number): Promise<void> {
  return api.delete(`/categorias/${id}`);
}
