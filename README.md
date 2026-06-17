# FoodStore - Admin App

Frontend de administración del sistema FoodStore. App interna para gestión de productos, categorías, ingredientes y pedidos.


# Link al video
[![Video de presentación](https://img.youtube.com/vi/00k1g5J8X4/0.jpg)](https://youtu.be/9mZBAH2CmGo)


## Tecnologías

- **React 19**: Biblioteca para interfaces de usuario
- **TypeScript**: Tipado estático
- **TanStack Query**: Gestión de estado del servidor
- **TanStack Table**: Tablas con ordenamiento
- **TanStack Form**: Formularios con validación
- **Axios**: Cliente HTTP
- **React Router**: Navegación SPA
- **Tailwind CSS**: Framework de estilos
- **Vite**: Build tool moderno

## Estructura del Proyecto (Feature-based)

```
FS-frontend/
├── src/
│   ├── api/                    # Cliente HTTP (Axios)
│   │   └── api.ts
│   ├── components/             # Componentes compartidos
│   │   ├── Navbar/
│   │   └── FormAlert/
│   ├── features/               # Módulos por dominio
│   │   ├── auth/               # Autenticación
│   │   │   ├── context/        # AuthContext (React Context)
│   │   │   ├── hooks/          # useAuth hook
│   │   │   ├── pages/          # Login, Register
│   │   │   ├── components/     # ProtectedRoute, PublicRoute
│   │   │   └── services/       # authService (login, register, logout)
│   │   ├── categorias/         # Gestión de categorías
│   │   │   ├── pages/
│   │   │   ├── components/     # CategoriaCard, CategoriaList, CategoriaModal, CategoriaDetailModal
│   │   │   └── services/
│   │   ├── ingredientes/       # Gestión de ingredientes
│   │   │   ├── pages/
│   │   │   ├── components/     # IngredienteCard, IngredienteList, IngredienteModal, IngredienteDetailModal
│   │   │   └── services/
│   │   ├── productos/          # Gestión de productos
│   │   │   ├── pages/
│   │   │   ├── components/     # ProductoCard, ProductoList, ProductoModal, ProductoDetailModal
│   │   │   └── services/
│   │   └── pedidos/            # Gestión de pedidos
│   │       └── pages/          # PedidosPage (placeholder)
│   ├── router/                 # Configuración de rutas
│   │   └── AppRouter.tsx
│   ├── shared/                 # Componentes compartidos entre features
│   │   └── components/
│   │       └── ConfirmModal/
│   ├── types/                  # Tipos TypeScript compartidos
│   │   ├── categoria.ts
│   │   ├── ingrediente.ts
│   │   ├── producto.ts
│   │   └── usuario.ts
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Punto de entrada
│   └── index.css               # Estilos globales
├── .env                        # Variables de entorno
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Arquitectura: Feature-based

Cada feature (auth, categorias, ingredientes, productos, pedidos) es un módulo independiente que contiene:

- **pages/**: Componentes de página (rutas)
- **components/**: Componentes de UI específicos del dominio
- **services/**: Llamadas a la API (Axios)
- **context/**, **hooks/**: Estado y lógica del dominio (solo auth)

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## Variables de Entorno

```env
VITE_API_URL=http://localhost:8000
```

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Redirige a `/categorias` |
| `/categorias` | Protegido | CRUD de categorías |
| `/productos` | Protegido | CRUD de productos |
| `/ingredientes` | Protegido | CRUD de ingredientes |
| `/pedidos` | Protegido | Listado de pedidos |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de usuario |

## Autenticación

- Login con email y password (JWT via cookies HttpOnly)
- Registro de nuevos usuarios
- Protección de rutas con `ProtectedRoute`
- Redirect a login si no hay sesión activa
- Botón de logout en el Navbar

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Iniciar servidor de desarrollo |
| `pnpm build` | Compilar para producción |
| `pnpm lint` | Ejecutar linter |
| `pnpm preview` | Previsualizar build |

## Backend

El backend corre en `http://localhost:8000`. Documentación en `/docs` (Swagger) o `/redoc`.

Ver `../FS-backend/README.md` para más detalles.
