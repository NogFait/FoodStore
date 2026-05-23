import * as direccionService from "../services/direccionService";
import type { Direccion } from "../types";
import  {useCrudOperations}  from "../../../hooks/useCrudOperations";

export function useDireccion() {
  const apiDireccion = useCrudOperations<Direccion>(
    ["direcciones"],
    (p) => direccionService.getDirecciones(p),
    (d) => direccionService.createDireccion(d as Omit<Direccion, "id">),
    (id, d) => direccionService.updateDireccion(id, d as Partial<Direccion>),
    (id) => direccionService.deleteDireccion(id),
  );

  return apiDireccion;
}