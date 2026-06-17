import api from "../../../api/api";
import type { Producto } from "../types";

export interface ProductoIngrediente {
  ingrediente_id: number;
  nombre: string;
  stock_cantidad: number;
  es_removible: boolean;
}

export const getIngredientesProducto = async (productoId: number): Promise<ProductoIngrediente[]> => {
  const { data } = await api.get(`/productos/${productoId}/ingredientes`);
  return data;
};

export function getProductos(params?: Record<string, string | number | boolean | undefined>) {
  return api.get<Producto[]>("/productos/", { params }).then((r) => r.data);
}

export function getProductoById(id: number): Promise<Producto> {
  return api.get<Producto>(`/productos/${id}`).then((r) => r.data);
}

export function createProducto(data: Omit<Producto, "id">): Promise<Producto> {
  return api.post<Producto>("/productos/", data).then((r) => r.data);
}

export function updateProducto(id: number, data: Partial<Producto>): Promise<Producto> {
  return api.patch<Producto>(`/productos/${id}`, data).then((r) => r.data);
}

export function deleteProducto(id: number): Promise<void> {
  return api.delete(`/productos/${id}`);
}
