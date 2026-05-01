import { fetchApi, type QueryParams } from "../api/api";
import type { Producto } from "../types/producto";

export function getProductos(params?: QueryParams): Promise<Producto[]> {
  return fetchApi<Producto[]>("/productos/", params);
}

export function getProductoById(id: number): Promise<Producto> {
  return fetchApi<Producto>(`/productos/${id}`);
}

export function createProducto(data: Omit<Producto, "id">): Promise<Producto> {
  return fetchApi<Producto>("/productos/", { method: "POST", body: JSON.stringify(data) });
}

export function updateProducto(id: number, data: Omit<Producto, "id">): Promise<Producto> {
  return fetchApi<Producto>(`/productos/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteProducto(id: number): Promise<void> {
  return fetchApi<void>(`/productos/${id}`, { method: "DELETE" });
}

export function getCategorias(params?: QueryParams): Promise<any[]> {
  return fetchApi<any[]>("/categorias/", params);
}

export function getIngredientes(params?: QueryParams): Promise<any[]> {
  return fetchApi<any[]>("/ingredientes/", params);
}
