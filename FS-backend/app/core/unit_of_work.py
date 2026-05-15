from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from app.core.database import get_session


class UnitOfWork:
    def __init__(self, session: Session) -> None:
        self._session = session
        self.session = session

    def __enter__(self) -> "UnitOfWork":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type is None:
            self._session.commit()
        else:
            self._session.rollback()

    def commit(self) -> None:
        self._session.commit()

    def rollback(self) -> None:
        self._session.rollback()


def get_uow(session: Annotated[Session, Depends(get_session)]) -> UnitOfWork:
    from app.usuarios.unit_of_work import UsuarioUnitOfWork
    return UsuarioUnitOfWork(session)
