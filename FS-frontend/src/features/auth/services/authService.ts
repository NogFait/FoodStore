import api, { API_BASE } from "../../../api/api";
import type { usuarioPublico, usuariosLogin, usuariosRegister, AuthResponse } from "../../../types/usuario";

export async function login(data: usuariosLogin): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);
  const res = await fetch(`${API_BASE}/api/v1/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
    credentials: "include",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Error al iniciar sesión");
  }
  return res.json();
}

export async function register(data: usuariosRegister): Promise<usuarioPublico> {
  return api.post<usuarioPublico>("/api/v1/auth/register", data).then((r) => r.data);
}

export async function getCurrentUser(): Promise<usuarioPublico | null> {
  try {
    return await api.get<usuarioPublico>("/api/v1/auth/me").then((r) => r.data);
  } catch {
    return null;
  }
}

export async function logout(): Promise<AuthResponse> {
  return api.post<AuthResponse>("/api/v1/auth/logout").then((r) => r.data);
}
