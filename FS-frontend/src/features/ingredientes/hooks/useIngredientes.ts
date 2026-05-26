import * as ingredienteService from "../services/ingredienteService";
import type { Ingrediente } from "../types";
import  {useCrudOperations}  from "../../../hooks/useCrudOperations";

export function useIngredientes() {
  const apiIngrediente = useCrudOperations<Ingrediente>(
    ["ingredientes"],
    (p) => ingredienteService.getIngredientes(p),
    (d) => ingredienteService.createIngrediente(d as Omit<Ingrediente, "id">),
    (id, d) => ingredienteService.updateIngrediente(id, d as Partial<Ingrediente>),
    (id) => ingredienteService.deleteIngrediente(id),
    [["ingredientes"],["productos"]],
  );

  return apiIngrediente;
}