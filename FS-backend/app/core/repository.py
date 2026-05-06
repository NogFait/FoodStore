from datetime import datetime
from typing import Generic, TypeVar, Type, Sequence
from sqlmodel import Session, SQLModel, select

ModelT = TypeVar("ModelT", bound=SQLModel)


class BaseRepository(Generic[ModelT]):
    def __init__(self, session: Session, model: Type[ModelT]) -> None:
        self.session = session
        self.model = model

    def get_by_id(self, record_id: int) -> ModelT | None:
        instance = self.session.get(self.model, record_id)
        if instance and hasattr(instance, 'deleted_at') and instance.deleted_at is not None:
            return None
        return instance

    def get_all(self, offset: int = 0, limit: int = 20) -> Sequence[ModelT]:
        stmt = select(self.model)
        if hasattr(self.model, 'deleted_at'):
            stmt = stmt.where(self.model.deleted_at.is_(None))
        return self.session.exec(stmt.offset(offset).limit(limit)).all()

    def add(self, instance: ModelT) -> ModelT:
        self.session.add(instance)
        self.session.flush()
        self.session.refresh(instance)
        return instance

    def delete(self, instance: ModelT) -> None:
        if hasattr(instance, 'deleted_at'):
            instance.deleted_at = datetime.now()
            self.session.add(instance)
        else:
            self.session.delete(instance)
        self.session.flush()