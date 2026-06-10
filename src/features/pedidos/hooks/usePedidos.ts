import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as pedidoService from "../services/pedidoService";
import type { PedidoResumen } from "../types";

type ListFilters = {
  offset: number;
  limit: number;
  estado_codigo?: string;
};

const QUERY_KEY = ["pedidos"] as const;

export function usePedidos() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ListFilters>({
    offset: 0,
    limit: 20,
  });

  const query = useQuery<PedidoResumen[]>({
    queryKey: [...QUERY_KEY, filters],
    queryFn: () => pedidoService.getPedidos(filters),
    staleTime: 30_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const avanzarMutation = useMutation({
    mutationFn: pedidoService.avanzarEstado,
    onSuccess: (pedido) => {
      toast.success(`Pedido #${pedido.id} → ${pedido.estado_pedido.nombre}`);
      invalidate();
    },
  });

  const cancelarMutation = useMutation({
    mutationFn: pedidoService.cancelarPedido,
    onSuccess: (pedido) => {
      toast.success(`Pedido #${pedido.id} cancelado`);
      invalidate();
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    filters,
    setFilters,
    avanzarMutation,
    cancelarMutation,
  };
}

export function usePedidoDetalle(pedidoId: number | null) {
  return useQuery({
    queryKey: ["pedido", pedidoId],
    queryFn: () => pedidoService.getPedidoById(pedidoId as number),
    enabled: pedidoId !== null,
    staleTime: 10_000,
  });
}
