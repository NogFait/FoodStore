import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWsStore } from "../store/wsStore";
const WS_URL = import.meta.env.VITE_APP_ENV === "prod" ? import.meta.env.VITE_WS_URL : "ws://localhost:8000/ws/pedidos";

const RECONNECT_BASE_MS = 2_000;
const RECONNECT_MAX_MS = 30_000;

export function usePedidosWS() {
  const setStatus = useWsStore((s) => s.setStatus);
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scheduleReconnect = () => {
    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** retryRef.current,
      RECONNECT_MAX_MS,
    );
    retryRef.current += 1;
    timerRef.current = setTimeout(connect, delay);
  };

  const connect = () => {
    // evita que un timeout stale de un socket anterior mate al nuevo
    clearTimeout(timerRef.current);
    wsRef.current?.close();
    setStatus("connecting");

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        retryRef.current = 0;
        setStatus("connected");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "estado_cambiado") {
            queryClient.invalidateQueries({ queryKey: ["pedidos"] });
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setStatus("disconnected");
        // solo reconecta si este socket sigue siendo el actual;
        // si fue cerrado por unmount/reconnect intencional, no reintentamos
        if (wsRef.current === ws) {
          scheduleReconnect();
        }
      };

      ws.onerror = () => {
        setStatus("error");
      };
    } catch {
      setStatus("error");
      scheduleReconnect();
    }
  };

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(timerRef.current);
      wsRef.current?.close();
      wsRef.current = null; // null ref para que onclose stale no reintente
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { reconnect: connect };
}
