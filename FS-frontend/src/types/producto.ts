
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url?: string;
  stock_cantidad: number;
  categorias_ids: number[];
}
