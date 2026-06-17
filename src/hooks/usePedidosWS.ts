import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWsConnection } from "./useWsConnection";
import type { PedidoResumen, EstadoPedidoCode } from "../features/pedidos/types";
import { construirEstadoPedido } from "../features/pedidos/utils";

const WS_URL =
  import.meta.env.VITE_APP_ENV === "prod"
    ? (import.meta.env.VITE_WS_URL as string)
    : "ws://localhost:8000/ws/pedidos";

interface EstadoCambiadoPayload {
  event: "estado_cambiado";
  pedido_id: number;
  estado_nuevo: string;
  estado_anterior: string | null;
}

function isEstadoCambiadoPayload(v: unknown): v is EstadoCambiadoPayload {
  return (
    typeof v === "object" &&
    v !== null &&
    (v as Record<string, unknown>)["event"] === "estado_cambiado"
  );
}

export function usePedidosWS() {
  const queryClient = useQueryClient();

  const onMessage = useCallback(
    (data: unknown) => {
      if (!isEstadoCambiadoPayload(data)) return;

      const { pedido_id, estado_nuevo } = data;

      // Cache surgery: update any cached PedidoResumen list that contains
      // this pedido_id, moving it to its new estado without a full refetch.
      // Falls back to a blanket invalidate so the next focus/mount refetches.
      let updatedInCache = false;

      queryClient.setQueriesData<PedidoResumen[]>(
        { queryKey: ["pedidos"] },
        (prev) => {
          if (!prev) return prev;
          const idx = prev.findIndex((p) => p.id === pedido_id);
          if (idx === -1) return prev;

          updatedInCache = true;
          const pedido = prev[idx];
          const updated: PedidoResumen = {
            ...pedido,
            estado_pedido: construirEstadoPedido(estado_nuevo as EstadoPedidoCode),
          };
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        },
      );

      if (!updatedInCache) {
        // Pedido not yet in any cached list — do a full invalidate
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      }

      // Also invalidate the individual pedido detail cache
      queryClient.invalidateQueries({ queryKey: ["pedido", pedido_id] });
    },
    [queryClient],
  );

  return useWsConnection(WS_URL, onMessage);
}
