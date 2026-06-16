import api from "../../../api/api";
import type { Producto, UploadResult } from "../types";

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

export function uploadImage(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  return api
    .post<UploadResult>("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function deleteImage(publicId: string): Promise<void> {
  // public_id may contain slashes — encode for the URL segment
  return api.delete(`/uploads/imagen/${encodeURIComponent(publicId)}`);
}
