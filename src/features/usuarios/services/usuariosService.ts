import api from "../../../api/api";
import type { AdminUserCreate, RolPublic, UsuarioPublico, UserRolAssign } from "../types";
import type { Role } from "../../auth/types";

/**
 * GET /api/v1/admin/usuarios — list all users (ADMIN only)
 */
export function getUsuarios(): Promise<UsuarioPublico[]> {
  return api.get<UsuarioPublico[]>("/admin/usuarios").then((r) => r.data);
}

/**
 * POST /api/v1/admin/usuarios/{user_id}/desactivar
 */
export function desactivarUsuario(userId: number): Promise<UsuarioPublico> {
  return api.post<UsuarioPublico>(`/admin/usuarios/${userId}/desactivar`).then((r) => r.data);
}

/**
 * POST /api/v1/admin/usuarios/{user_id}/activar
 */
export function activarUsuario(userId: number): Promise<UsuarioPublico> {
  return api.post<UsuarioPublico>(`/admin/usuarios/${userId}/activar`).then((r) => r.data);
}

/**
 * GET /api/v1/admin/roles — list all system roles (ADMIN only)
 */
export function getRoles(): Promise<RolPublic[]> {
  return api.get<RolPublic[]>("/admin/roles").then((r) => r.data);
}

/**
 * POST /api/v1/admin/usuarios/{user_id}/roles — assign a role
 */
export function asignarRol(userId: number, payload: UserRolAssign): Promise<UsuarioPublico> {
  return api.post<UsuarioPublico>(`/admin/usuarios/${userId}/roles`, payload).then((r) => r.data);
}

/**
 * DELETE /api/v1/admin/usuarios/{user_id}/roles/{rol_codigo} — remove a role
 */
export function quitarRol(userId: number, rolCodigo: Role): Promise<UsuarioPublico> {
  return api
    .delete<UsuarioPublico>(`/admin/usuarios/${userId}/roles/${rolCodigo}`)
    .then((r) => r.data);
}

/**
 * POST /api/v1/admin/usuarios — create a user with roles (admin only)
 */
export function crearUsuario(payload: AdminUserCreate): Promise<UsuarioPublico> {
  return api.post<UsuarioPublico>("/admin/usuarios", payload).then((r) => r.data);
}
