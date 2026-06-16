import type { Role } from "../../auth/types";

export interface RolPublic {
  id: number;
  codigo: Role;
  descripcion: string;
}

export interface UsuarioPublico {
  id: number;
  username: string;
  full_name: string;
  email: string;
  roles: Role[];
  disabled: boolean;
}

export interface UserRolAssign {
  rol_codigo: Role;
  expires_at?: string | null;
}
