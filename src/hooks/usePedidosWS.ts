import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWsStore } from "../store/wsStore";

const WS_URL = "ws://localhost:8000/ws/pedidos";

const RECONNECT_BASE_MS = 2_000;
const RECONNECT_MAX_MS = 30_000;

export function usePedidosWS() {
  const setStatus = useWsStore((s) => s.setStatus);
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const scheduleReconnect = () => {
    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** retryRef.current,
      RECONNECT_MAX_MS,
    );
    retryRef.current += 1;
    timerRef.current = setTimeout(connect, delay);
  };

  const connect = () => {
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
        scheduleReconnect();
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { reconnect: connect };
}
