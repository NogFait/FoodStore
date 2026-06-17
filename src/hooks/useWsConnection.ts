/**
 * Shared WebSocket connection hook.
 * Encapsulates reconnect-with-exponential-backoff logic so individual
 * feature WS hooks (usePedidosWS, useIngredientesWS, …) don't duplicate it.
 */

import { useEffect, useRef } from "react";
import { useWsStore } from "../store/wsStore";

const RECONNECT_BASE_MS = 2_000;
const RECONNECT_MAX_MS = 30_000;

export type WsMessageHandler = (data: unknown) => void;

/**
 * Opens a WebSocket to `url` and calls `onMessage` for every parsed JSON
 * message. Handles reconnect with exponential backoff automatically.
 *
 * Returns a `reconnect` function to force an immediate reconnect.
 */
export function useWsConnection(url: string, onMessage: WsMessageHandler) {
  const setStatus = useWsStore((s) => s.setStatus);
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Keep the latest handler without triggering reconnects on re-renders
  const handlerRef = useRef<WsMessageHandler>(onMessage);
  handlerRef.current = onMessage;

  const scheduleReconnect = () => {
    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** retryRef.current,
      RECONNECT_MAX_MS,
    );
    retryRef.current += 1;
    timerRef.current = setTimeout(connect, delay);
  };

  // eslint-disable-next-line prefer-const
  let connect: () => void;

  connect = () => {
    clearTimeout(timerRef.current);
    wsRef.current?.close();
    setStatus("connecting");

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retryRef.current = 0;
        setStatus("connected");
      };

      ws.onmessage = (event) => {
        try {
          const data: unknown = JSON.parse(event.data as string);
          handlerRef.current(data);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setStatus("disconnected");
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
      wsRef.current = null;
    };
    // url changes would require a new connection — include it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { reconnect: connect };
}
