from datetime import datetime
from sqlmodel import SQLModel, Field
from sqlmodel import SQLModel, Field, Relationship


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_token"

    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    token_hash: str = Field(max_length=64)
    expires_at: datetime
    revoked_at: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.now)

    usuario: "Usuario" = Relationship(back_populates="refresh_tokens")