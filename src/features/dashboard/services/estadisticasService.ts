import api from "../../../api/api";

export interface ResumenStats {
  total_pedidos: number;
  ventas_totales: string;
  ticket_promedio: string;
  pedidos_pendientes: number;
  productos_activos: number;
}

export interface VentaPeriodo {
  periodo: string;
  total: string;
  cantidad_pedidos: number;
}

export interface ProductoMasVendido {
  producto_id: number | null;
  nombre: string;
  cantidad_vendida: number;
  ingresos: string;
}

export interface VentaCategoria {
  categoria_id: number;
  categoria: string;
  total: string;
  cantidad: number;
}

export interface PedidoEstado {
  estado: string;
  cantidad: number;
}

export type Agrupacion = "dia" | "mes";

export function getResumen(): Promise<ResumenStats> {
  return api.get<ResumenStats>("/estadisticas/resumen").then((r) => r.data);
}

export function getVentasPorPeriodo(
  desde: string,
  hasta: string,
  agrupacion: Agrupacion = "dia",
): Promise<VentaPeriodo[]> {
  return api
    .get<VentaPeriodo[]>("/estadisticas/ventas-por-periodo", {
      params: { desde, hasta, agrupacion },
    })
    .then((r) => r.data);
}

export function getProductosMasVendidos(limit = 10): Promise<ProductoMasVendido[]> {
  return api
    .get<ProductoMasVendido[]>("/estadisticas/productos-mas-vendidos", {
      params: { limit },
    })
    .then((r) => r.data);
}

export function getVentasPorCategoria(): Promise<VentaCategoria[]> {
  return api.get<VentaCategoria[]>("/estadisticas/ventas-por-categoria").then((r) => r.data);
}

export function getPedidosPorEstado(): Promise<PedidoEstado[]> {
  return api.get<PedidoEstado[]>("/estadisticas/pedidos-por-estado").then((r) => r.data);
}
