from enum import StrEnum


class RolEnum(StrEnum):
    """Roles del sistema. Fijos por dominio — no se crean en runtime."""

    ADMIN = "ADMIN"
    CLIENTE = "CLIENTE"
    COCINA = "COCINA"
