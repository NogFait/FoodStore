export interface usuariosRegister {
    username:  string
    full_name: string
    email:     string
    password:  string
    
}
export type Role = "ADMIN" | "CLIENT" | "PEDIDOS" | "STOCK";
export interface usuariosLogin {
    email: string
    password: string
}

export interface usuarioPublico {
    id: number;
    username: string;
    full_name: string;
    email: string;
    roles: Role[];
    disabled: boolean;
}

export interface AuthResponse {
    mensaje: string;
}

export type AuthContextType = {
  user: usuarioPublico | null;
  isLoading: boolean;
  login: (data: usuariosLogin) => Promise<void>;
  register: (data: usuariosRegister) => Promise<void>;
  logout: () => Promise<void>;
};