export interface ProductoIngrediente {
  ingrediente_id: number;
  cantidad?: number | null;
  unidad_medida_id?: number | null;
  es_removible: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url?: string;
  stock_cantidad: number;
  disponible: boolean;
  unidad_venta_id?: number;
  categorias_ids: number[];
  ingredientes_ids: number[];
  ingredientes: ProductoIngrediente[];
}
