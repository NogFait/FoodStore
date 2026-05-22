from typing import List, Any
from sqlmodel import SQLModel, Field
from pydantic import EmailStr, field_validator

class UserCreate(SQLModel):
    """Datos requeridos para registrar un usuario."""
    username:  str
    full_name: str
    email:     EmailStr
    password:  str = Field(min_length=8)

class UserPublic(SQLModel):
    """Vista pública del usuario — excluye hashed_password."""
    id:        int
    username:  str
    full_name: str
    email:     str
    roles:     List[str] = []
    disabled:  bool

    @field_validator("roles", mode="before")
    @classmethod
    def coerce_roles(cls, v: Any) -> List[str]:
        if v and hasattr(v[0], "codigo"):
            return [r.codigo for r in v]
        return v

class Token(SQLModel):
    """Respuesta del endpoint /token."""
    access_token: str
    token_type:   str = "bearer"
    expires_in:   int
