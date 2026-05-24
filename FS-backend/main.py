from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session

from app.core.database import engine
from app.core.seed import seed_admin_user

# Registrar modelos sin router propio en SQLModel.metadata antes de create_all
from app.refresh_token import model as _refresh_token_model  # noqa: F401

# Routers de dominio
from app.categoria.router import router_categoria
from app.producto.router import router_producto
from app.ingrediente.router import router_ingrediente
from app.usuarios.router import auth as router_auth, admin as router_admin
from app.direccion.router import router_direccion
from app.unidad_medida.router import router_unidad_medida


# ─── Ciclo de vida ────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: crear tablas y seedear admin inicial
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_admin_user(session)
    yield
    # Shutdown: nada por ahora


app = FastAPI(lifespan=lifespan)


# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(router_categoria)
app.include_router(router_producto)
app.include_router(router_ingrediente)
app.include_router(router_auth)
app.include_router(router_admin)
app.include_router(router_direccion)
app.include_router(router_unidad_medida)
