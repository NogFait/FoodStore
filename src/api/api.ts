import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});

// Request interceptor — log de peticiones en desarrollo.
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      );
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — manejo global de errores y sesión expirada.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";

    // /auth/me devuelve 401 cuando no hay sesión — es esperado, no redirigir.
    const isAuthCheck =
      url.includes("/auth/me") ||
      url.includes("/auth/token") ||
      url.includes("/auth/register");

    if (status === 401 && !isAuthCheck) {
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
