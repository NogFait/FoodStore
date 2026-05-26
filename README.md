# FoodStore - Sistema de Gestión de Restaurant

Sistema de gestión integral para FoodStore con backend en FastAPI y frontend en React.

# Video de Presentación de la demo del sistema

## Estructura del Proyecto

```
FoodStore/
├── FS-backend/              # Backend - FastAPI + SQLModel + PostgreSQL
├── FS-frontend/             # Admin app - React + TanStack Table + Axios
```
## Link al repositorio del cliente
https://github.com/Seb-Saez/Prog4_tpi_integrador_frontend_client

### Dos Frontends Independientes

| App | Carpeta | Propósito | Stack |
|-----|---------|-----------|-------|
| **Admin** | `FS-frontend/` | Gestión interna | pnpm, TanStack Table/Form, React Router |

Ambos frontends comparten el mismo backend (`localhost:8000`) y se autentican con JWT via cookies HttpOnly.

## Tecnologías

### Backend
- **FastAPI**: Framework web moderno y rápido
- **SQLModel**: ORM con soporte para SQLAlchemy
- **PostgreSQL**: Base de datos relacional
- **Python**: Lenguaje de programación

### Frontend Admin (FS-frontend)
- **React 19**: Biblioteca para interfaces de usuario
- **TanStack Query**: Gestión de estado del servidor
- **TanStack Table**: Tablas con ordenamiento y acciones
- **TanStack Form**: Formularios con validación
- **Tailwind CSS**: Framework de estilos
- **TypeScript**: Tipado estático
- **Vite**: Build tool moderno

### Frontend Store (FS-Frontend-cliente)
- **React 19**: Biblioteca para interfaces de usuario
- **TanStack Query**: Gestión de estado del servidor
- **Zustand**: Estado global (carrito de compras)
- **Tailwind CSS**: Framework de estilos
- **TypeScript**: Tipado estático
- **Vite**: Build tool moderno

## Requisitos

### Backend
- Python 3.10+
- PostgreSQL

### Frontend
- Node.js 18+
- pnpm (para admin) o npm (para store)

## Instalación

### Backend
```bash
cd FS-backend
pip install -r requirements.txt
# Configurar variables de entorno
python main.py
```

### Frontend Admin
```bash
cd FS-frontend
pnpm install
pnpm dev
```

### Frontend Store
```bash
cd FS-Frontend-cliente
npm install
npm run dev
```

## Características

### Admin App
- **Gestión de Productos**: CRUD completo con categorías e ingredientes
- **Gestión de Categorías**: Organización de productos
- **Gestión de Ingredientes**: Control de ingredientes y alérgenos
- **Autenticación**: Login/register con JWT y roles (admin)
- **Paginación**: Navegación entre páginas de resultados
- **Filtros**: Búsqueda por disponibilidad y alérgenos
- **Relaciones N:N**: Productos-Categorías, Productos-Ingredientes

### Store App
- **Catálogo de productos**: Vista con tarjetas visuales
- **Carrito de compras**: Estado con Zustand
- **Autenticación**: Login/register para historial de pedidos
- **Navegación pública**: Sin necesidad de login para navegar

## API Endpoints

### Productos
- `GET /productos/` - Listar productos (soporta paginación y filtros)
- `POST /productos/` - Crear producto
- `GET /productos/{id}` - Obtener producto
- `PATCH /productos/{id}` - Actualizar producto
- `DELETE /productos/{id}` - Eliminar producto

### Categorías
- `GET /categorias/` - Listar categorías
- `POST /categorias/` - Crear categoría
- `GET /categorias/{id}` - Obtener categoría
- `PATCH /categorias/{id}` - Actualizar categoría
- `DELETE /categorias/{id}` - Eliminar categoría

### Ingredientes
- `GET /ingredientes/` - Listar ingredientes
- `POST /ingredientes/` - Crear ingrediente
- `GET /ingredientes/{id}` - Obtener ingrediente
- `PATCH /ingredientes/{id}` - Actualizar ingrediente
- `DELETE /ingredientes/{id}` - Eliminar ingrediente
