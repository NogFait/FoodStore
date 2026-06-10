import * as productoService from "../services/productoService";
import type { Producto } from "../types";
import { useCrudOperations } from "../../../hooks/useCrudOperations";

export function useProductos() {
    const apiProducto = useCrudOperations<Producto>(
        ["productos"],
        (p) => productoService.getProductos(p),
        (d) => productoService.createProducto(d as Omit<Producto, "id">),
        (id, d) => productoService.updateProducto(id, d as Partial<Producto>),
        (id) => productoService.deleteProducto(id),
    );

    return apiProducto;
}