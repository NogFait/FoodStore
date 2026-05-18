export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url?: string;
  stock_cantidad: number;
  disponible: boolean;
  categorias_ids: number[];
  ingredientes_ids: number[];
}
