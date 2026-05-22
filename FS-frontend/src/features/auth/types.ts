export interface usuariosRegister {
    username:  string
    full_name: string
    email:     string
    password:  string
    
}

export interface usuariosLogin {
    email: string
    password: string
}

export interface usuarioPublico {
    id: number;
    username: string;
    full_name: string;
    email: string;
    roles: string[];
    disabled: boolean;
}

export interface AuthResponse {
    mensaje: string;
}
