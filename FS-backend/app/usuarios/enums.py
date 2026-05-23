from enum import StrEnum


class RolEnum(StrEnum):
    """Roles del sistema. Fijos por dominio — no se crean en runtime."""

    ADMIN = "admin"
    CLIENTE = "cliente"
    COCINA = "cocina"
