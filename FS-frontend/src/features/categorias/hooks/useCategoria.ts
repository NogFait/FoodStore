import * as categoriaService from "../services/categoriaService";
import type { Categoria } from "../types";
import  {useCrudOperations}  from "../../../hooks/useCrudOperations";

export function useCategoria() {
  const apiCategoria = useCrudOperations<Categoria>(
    ["categorias"],
    (p) => categoriaService.getCategorias(p),
    (d) => categoriaService.createCategoria(d as Omit<Categoria, "id">),
    (id, d) => categoriaService.updateCategoria(id, d as Partial<Categoria>),
    (id) => categoriaService.deleteCategoria(id),
    [["productos"]],
  );

  return apiCategoria;
}