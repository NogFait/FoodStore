import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWsConnection } from "../../../hooks/useWsConnection";
import type { Ingrediente } from "../types";

const WS_URL =
  import.meta.env.VITE_APP_ENV === "prod"
    ? (import.meta.env.VITE_WS_URL as string)
    : "ws://localhost:8000/ws/pedidos"; // same WS channel — server fans out all events

interface StockIngredientePayload {
  event: "stock_ingrediente";
  ingrediente_id: number;
  nombre: string;
  stock_cantidad: number;
  faltante: boolean;
}

function isStockIngredientePayload(v: unknown): v is StockIngredientePayload {
  return (
    typeof v === "object" &&
    v !== null &&
    (v as Record<string, unknown>)["event"] === "stock_ingrediente"
  );
}

export function useIngredientesWS() {
  const queryClient = useQueryClient();

  const onMessage = useCallback(
    (data: unknown) => {
      if (!isStockIngredientePayload(data)) return;

      const { ingrediente_id, nombre, stock_cantidad, faltante } = data;

      // Cache surgery: update any cached list that contains this ingrediente_id
      let updatedInCache = false;

      queryClient.setQueriesData<Ingrediente[]>(
        { queryKey: ["ingredientes"] },
        (prev) => {
          if (!prev) return prev;
          const idx = prev.findIndex((i) => i.id === ingrediente_id);
          if (idx === -1) return prev;

          updatedInCache = true;
          const copy = [...prev];
          copy[idx] = { ...copy[idx], stock_cantidad };
          return copy;
        },
      );

      if (!updatedInCache) {
        queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      }

      // Toast notification
      if (faltante) {
        toast.warning(`Ingrediente faltante: ${nombre} (stock agotado)`, {
          id: `stock-${ingrediente_id}`,
        });
      } else {
        toast.success(
          `Stock repuesto: ${nombre} (${stock_cantidad} unidades)`,
          { id: `stock-${ingrediente_id}` },
        );
      }
    },
    [queryClient],
  );

  return useWsConnection(WS_URL, onMessage);
}
