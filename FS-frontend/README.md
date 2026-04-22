# FoodStore Frontend

Frontend del sistema de gestión de FoodStore construido con React.

## Tecnologías

- **React 19**: Biblioteca para interfaces de usuario
- **TypeScript**: Tipado estático
- **TanStack Query**: Gestión de estado del servidor
- **React Router**: Navegación SPA
- **Tailwind CSS**: Framework de estilos
- **Vite**: Build tool moderno

## Estructura del Proyecto

```
FS-frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── CategoriaCard/
│   │   ├── CategoriaList/
│   │   ├── CategoriaModal/
│   │   ├── CategoriaDetailModal/
│   │   ├── ConfirmModal/
│   │   ├── FormAlert/
│   │   ├── IngredienteCard/
│   │   ├── IngredienteList/
│   │   ├── IngredienteModal/
│   │   ├── IngredienteDetailModal/
│   │   ├── Navbar/
│   │   ├── ProductoCard/
│   │   ├── ProductoList/
│   │   ├── ProductoModal/
│   │   └── ProductoDetailModal/
│   ├── pages/                # Páginas principales
│   │   ├── CategoriasPage.tsx
│   │   ├── IngredientesPage.tsx
│   │   └── ProductosPage.tsx
│   ├── types/                # Tipos TypeScript
│   │   ├── categoria.ts
│   │   ├── ingrediente.ts
│   │   └── producto.ts
│   ├── lib/                  # Utilidades
│   │   └── api.ts           # Cliente API
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Instalación

1. Instalar dependencias:
```bash
pnpm install
# o
npm install
```

2. Iniciar servidor de desarrollo:
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## Características

### Gestión de Productos
- Listado con paginación
- Filtrado por disponibilidad
- Crear, editar, eliminar productos
- Asociación con categorías
- Modal de detalles

### Gestión de Categorías
- Listado con paginación
- Crear, editar, eliminar categorías
- Modal de detalles

### Gestión de Ingredientes
- Listado con paginación
- Filtrado por alérgenos
- Crear, editar, eliminar ingredientes
- Indicador visual de alérgenos

### UI/UX
- Diseño responsive con Tailwind CSS
- Validación de formularios en tiempo real
- Estados de carga y error
- Confirmación para acciones destructivas
- Alertas visuales para errores

## Páginas

### Productos (`/productos`)
- Tabla con listados de productos
- Filtro por disponibilidad
- Navegación por páginas
- Acciones: Ver, Editar, Eliminar

### Categorías (`/categorias`)
- Grid/listado de categorías
- Navegación por páginas
- Acciones: Ver, Editar, Eliminar

### Ingredientes (`/ingredientes`)
- Listado de ingredientes
- Filtro por alérgenos
- Navegación por páginas
- Indicador visual de alérgenos
- Acciones: Ver, Editar, Eliminar

## Integración con API

El frontend se comunica con el backend en `http://localhost:8000`:

```typescript
// Ejemplo de fetching
import { fetchApi } from './lib/api';

const productos = await fetchApi<Producto[]>('/productos/', {
  skip: 0,
  limit: 20,
  disponible: true,
});
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Iniciar servidor de desarrollo |
| `pnpm build` | Compilar para producción |
| `pnpm lint` | Ejecutar linter |
| `pnpm preview` | Previsualizar build |

## Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:8000
```

### Puerto
El servidor de desarrollo corre en `5173` por defecto.

## Componentes Principales

### ProductoCard / CategoriaCard / IngredienteCard
Tarjetas individuales para mostrar cada entidad.

### ProductoList / CategoriaList / IngredienteList
Listados que reciben datos y callbacks de acciones.

### ProductoModal / CategoriaModal / IngredienteModal
Formularios para crear y editar entidades.

### ConfirmModal
Modal de confirmación para acciones destructivas.

### FormAlert
Componente reutilizable para mostrar errores.

## Estado con TanStack Query

```typescript
// Query con cache
const { data, isLoading, error } = useQuery({
  queryKey: ['productos', pagination],
  queryFn: () => fetchApi('/productos/', pagination),
});

// Mutation con invalidación de caché
const mutation = useMutation({
  mutationFn: (data) => createProducto(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['productos'] });
  },
});
```


