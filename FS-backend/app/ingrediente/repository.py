from sqlmodel import Session
from app.core.repository import BaseRepository
from app.ingrediente.model import Ingrediente


class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Ingrediente)