import { useQuery } from "@tanstack/react-query";
import {
  getResumen,
  getVentasPorPeriodo,
  getProductosMasVendidos,
  getVentasPorCategoria,
  getPedidosPorEstado,
  type Agrupacion,
} from "../services/estadisticasService";

const STALE = 5 * 60 * 1000; // 5 min

export function useResumen() {
  return useQuery({
    queryKey: ["estadisticas", "resumen"],
    queryFn: getResumen,
    staleTime: STALE,
  });
}

export function useVentasPorPeriodo(desde: string, hasta: string, agrupacion: Agrupacion) {
  return useQuery({
    queryKey: ["estadisticas", "ventas-periodo", desde, hasta, agrupacion],
    queryFn: () => getVentasPorPeriodo(desde, hasta, agrupacion),
    staleTime: STALE,
    enabled: !!desde && !!hasta,
  });
}

export function useProductosMasVendidos(limit = 10) {
  return useQuery({
    queryKey: ["estadisticas", "productos-mas-vendidos", limit],
    queryFn: () => getProductosMasVendidos(limit),
    staleTime: STALE,
  });
}

export function useVentasPorCategoria() {
  return useQuery({
    queryKey: ["estadisticas", "ventas-categoria"],
    queryFn: getVentasPorCategoria,
    staleTime: STALE,
  });
}

export function usePedidosPorEstado() {
  return useQuery({
    queryKey: ["estadisticas", "pedidos-estado"],
    queryFn: getPedidosPorEstado,
    staleTime: STALE,
  });
}
