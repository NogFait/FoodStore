from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.core.database import engine

# Importamos el router de categorías (donde están los endpoints)
from app.categoria.router import router_categoria
from app.producto.router import router_producto
from app.producto_categoria.router import router_producto_categoria
from app.ingrediente.router import router_ingrediente
from app.producto_ingrediente.router import router_producto_ingrediente


# Creamos la instancia principal de la aplicación FastAPI
app = FastAPI()

# ============================
# CREAR TABLAS EN LA DB
# ============================
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# ============================
# CONFIGURACIÓN DE CORS
# ============================
# Esto permite que el frontend (por ejemplo React en localhost:5173)
# pueda hacer peticiones a este backend sin que el navegador las bloquee
app.add_middleware(
    CORSMiddleware,
    
    # Lista de orígenes permitidos (frontend)
    # En este caso, permitimos el acceso desde React en localhost:5173
    allow_origins=["*"],
    
    # Métodos HTTP permitidos (GET, POST, PUT, DELETE, etc.)
    # "*" significa que se permiten todos
    allow_methods=["*"],
    
    # Headers permitidos en las peticiones (ej: Content-Type, Authorization)
    # "*" permite todos los headers
    allow_headers=["*"],
)

# ============================
# REGISTRO DE RUTAS
# ============================
# Acá conectamos el router de categorías con la app principal
# Todas las rutas definidas en categoria.router estarán disponibles
app.include_router(router_categoria)
app.include_router(router_producto)
app.include_router(router_ingrediente)
app.include_router(router_producto_ingrediente)
app.include_router(router_producto_categoria)