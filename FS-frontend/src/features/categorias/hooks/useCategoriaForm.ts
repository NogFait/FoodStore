import { useEffect, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import type { Categoria } from "../types";

function buildParentTree(categorias: Categoria[], excludeId?: number) {
  const map = new Map<number | null, Categoria[]>();
  categorias.forEach((c) => {
    if (c.id === excludeId) return;
    const k = c.parent_id ?? null;
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(c);
  });
  map.forEach((v) => v.sort((a, b) => a.id - b.id));

  const flat: (Categoria & { depth: number })[] = [];
  function walk(parentId: number | null, depth: number) {
    const children = map.get(parentId) || [];
    children.forEach((c) => {
      flat.push({ ...c, depth });
      walk(c.id, depth + 1);
    });
  }
  walk(null, 0);
  return flat;
}

export function useCategoriaForm(
  categoria: Categoria | null,
  categorias: Categoria[],
  onSubmit: (data: { nombre: string; descripcion: string; imagen_url?: string; parent_id?: number | null }) => void,
) {
  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      imagen_url: "",
      parent_id: undefined as number | undefined | null,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre,
        descripcion: value.descripcion,
        imagen_url: value.imagen_url || undefined,
        parent_id: value.parent_id ?? null,
      });
    },
  });

  useEffect(() => {
    if (categoria) {
      form.setFieldValue("nombre", categoria.nombre);
      form.setFieldValue("descripcion", categoria.descripcion);
      form.setFieldValue("imagen_url", categoria.imagen_url || "");
      form.setFieldValue("parent_id", categoria.parent_id);
    } else {
      form.setFieldValue("nombre", "");
      form.setFieldValue("descripcion", "");
      form.setFieldValue("imagen_url", "");
      form.setFieldValue("parent_id", undefined);
    }
  }, [categoria,form]);

  const parentOptions = useMemo(
    () => buildParentTree(categorias, categoria ? categoria.id : undefined),
    [categorias, categoria],
  );

  return {
    form,
    esModoEditar: !!categoria,
    parentOptions,
  };
}
