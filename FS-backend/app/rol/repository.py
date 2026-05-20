from sqlmodel import Session
from app.core.repository import BaseRepository
from app.rol.model import Rol

class RolRepository(BaseRepository[Rol]):
    def __init__(self, session: Session)->None:
        super().__init__(session,Rol)