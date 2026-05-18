# FoodStore - Sistema de Gestión de Restaurant




Sistema de gestión integral para FoodStore con backend en FastAPI y frontend en React.

# Video de Presentación de la demo del sistema
https://youtu.be/bpHejGNNPj4

## Estructura del Proyecto

```
FoodStore/
├── FS-backend/       # Backend - FastAPI + SQLModel + PostgreSQL
└── FS-frontend/      # Frontend - React + TanStack Query + Tailwind CSS
```

## Tecnologías

### Backend
- **FastAPI**: Framework web moderno y rápido
- **SQLModel**: ORM con soporte para SQLAlchemy
- **PostgreSQL**: Base de datos relacional
- **Python**: Lenguaje de programación

### Frontend
- **React**: Biblioteca para interfaces de usuario
- **TanStack Query**: Gestión de estado del servidor
- **Tailwind CSS**: Framework de estilos
- **TypeScript**: Tipado estático
- **Vite**: Build tool moderno

## Requisitos

### Backend
- Python 3.10+
- PostgreSQL

### Frontend
- Node.js 18+
- pnpm (o npm)

## Instalación

### Backend
```bash
cd FS-backend
pip install -r requirements.txt
# Configurar variables de entorno
python main.py
```

### Frontend
```bash
cd FS-frontend
pnpm install
pnpm dev
```

## Características

- **Gestión de Productos**: CRUD completo con categorías
- **Gestión de Categorías**: Organización de productos
- **Gestión de Ingredientes**: Control de ingredientes y alérgenos
- **Relaciones N:N**: Productos-Categorías, Productos-Ingredientes
- **Paginación**: Navegación entre páginas de resultados
- **Filtros**: Búsqueda por disponibilidad y alérgenos

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


