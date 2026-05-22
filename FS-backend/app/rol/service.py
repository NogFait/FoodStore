from fastapi import HTTPException, status
from app.rol.model import Rol
from app.rol.schema import RolCreate, RolUpdate
from app.rol.unit_of_work import RolUnitOfWork

class RolService:
    def __init__(self, session):
        self._session = session
    def _get_or_404(self, uow, codigo: str) -> Rol:
        rol = uow.roles.get_by_id(codigo)
        if not rol:
            raise HTTPException(status_code=404, detail="Rol no encontrado")
        return rol
    
    def create(self, data: RolCreate) -> Rol:
        with RolUnitOfWork(self._session) as uow:
            existe = uow.roles.get_by_id(data.codigo)
            if existe:
                raise HTTPException(status_code=409, detail="El código de rol ya existe")
            rol = Rol.model_validate(data)
            uow.roles.add(rol)
            return rol
        
    def list_all(self, skip: int = 0, limit: int = 20) -> list[Rol]:
        with RolUnitOfWork(self._session) as uow:
            return uow.roles.get_all(offset=skip, limit=limit)
        
    def get_by_codigo(self, codigo: str) -> Rol:
        with RolUnitOfWork(self._session) as uow:
            return self._get_or_404(uow, codigo)
        
    def update(self, codigo: str, data: RolUpdate) -> Rol:
        with RolUnitOfWork(self._session) as uow:
            rol = self._get_or_404(uow, codigo)
            update_data = data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(rol, field, value)
            uow.roles.add(rol)
            return rol
        
    def delete(self, codigo: str) -> None:
        with RolUnitOfWork(self._session) as uow:
            rol = self._get_or_404(uow, codigo)
            uow.roles.delete(rol)


def create_rol(session, data: RolCreate) -> Rol:
    return RolService(session).create(data)

def list_roles(session, skip: int = 0, limit: int = 20) -> list[Rol]:
    return RolService(session).list_all(skip=skip, limit=limit)

def get_rol(session, codigo: str) -> Rol:
    return RolService(session).get_by_codigo(codigo)

def update_rol(session, codigo: str, data: RolUpdate) -> Rol:
    return RolService(session).update(codigo, data)

def delete_rol(session, codigo: str) -> None:
    return RolService(session).delete(codigo)