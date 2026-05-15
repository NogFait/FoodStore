import { fetchApi, API_BASE } from "../api/api";
import type { usuarioPublico, usuariosLogin, usuariosRegister, AuthResponse } from "../types/usuario";
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
    return fetchApi<usuarioPublico>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
export async function getCurrentUser(): Promise<usuarioPublico | null> {
    try {
        return await fetchApi<usuarioPublico>("/api/v1/auth/me");
    } catch {
        return null;
    }
}
export async function logout(): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/api/v1/auth/logout", { method: "POST" });
}