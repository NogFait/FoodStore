import { create } from "zustand";

type WsStatus = "disconnected" | "connecting" | "connected" | "error";

interface WsStore {
  status: WsStatus;
  setStatus: (s: WsStatus) => void;
}

export const useWsStore = create<WsStore>((set) => ({
  status: "disconnected",
  setStatus: (status) => set({ status }),
}));
