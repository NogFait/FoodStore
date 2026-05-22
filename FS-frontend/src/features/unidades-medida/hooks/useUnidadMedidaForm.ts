import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import type { UnidadMedida } from "../types";

export function useUnidadMedidaForm(
  unidad: UnidadMedida | null,
  onSubmit: (data: { nombre: string; simbolo: string; tipo: string }) => void,
) {
  const form = useForm({
    defaultValues: {
      nombre: "",
      simbolo: "",
      tipo: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre,
        simbolo: value.simbolo,
        tipo: value.tipo,
      });
    },
  });

  useEffect(() => {
    if (unidad) {
      form.setFieldValue("nombre", unidad.nombre);
      form.setFieldValue("simbolo", unidad.simbolo);
      form.setFieldValue("tipo", unidad.tipo);
    } else {
      form.setFieldValue("nombre", "");
      form.setFieldValue("simbolo", "");
      form.setFieldValue("tipo", "");
    }
  }, [unidad]);

  return {
    form,
    esModoEditar: !!unidad,
    titulo: unidad ? "Editar Unidad de Medida" : "Nueva Unidad de Medida",
  };
}
