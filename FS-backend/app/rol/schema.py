from sqlmodel import SQLModel

class RolBase(SQLModel):
    codigo: str
    nombre: str
    descripcion: str | None = None

class RolCreate(RolBase):
    pass

class RolResponse(RolBase):
    pass


class RolUpdate(SQLModel):
    nombre: str | None = None
    descripcion:str | None = None