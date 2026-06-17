import api from "../../../api/api";
import type { usuarioPublico, usuariosLogin, usuariosRegister, AuthResponse,Role } from "../types";

export async function login(data: usuariosLogin): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);
  
  const res = await api.post<AuthResponse>(`/auth/token`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return res.data;
}

export async function register(data: usuariosRegister): Promise<usuarioPublico> {
  return api.post<usuarioPublico>(`/auth/register`, data).then((r) => r.data);
}
// validar que el usuario realmente tenga id y roles asi funcona la validacion del protectedRoute

function isValidUser(user: unknown): user is usuarioPublico {
  if (!user || typeof user !== "object") return false;
  const u = user as Record<string, unknown>;
  const validRoles: Role[] = ["ADMIN", "COCINA", "CAJA", "CLIENT"];
  return (
    typeof u.id === "number" &&
    typeof u.username === "string" &&
    typeof u.full_name === "string" &&
    typeof u.email === "string" &&
    Array.isArray(u.roles) &&
    u.roles.every((r: unknown) => typeof r === "string" && validRoles.includes(r as Role)) &&
    typeof u.disabled === "boolean" && u.disabled === false
  )
}

export async function getCurrentUser(): Promise<usuarioPublico | null> {
  try {
    const res = await api.get<usuarioPublico>(`/auth/me`);
    if (!isValidUser(res.data)) return null;
    return res.data;
  } catch {
    return null;
  }
}

export async function logout(): Promise<AuthResponse> {
  return api.post<AuthResponse>(`/auth/logout`).then((r) => r.data);
}
