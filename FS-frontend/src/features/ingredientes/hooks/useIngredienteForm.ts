import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import type { Ingrediente } from "../types";

export function useIngredienteForm(
  ingrediente: Ingrediente | null,
  isOpen: boolean,
  onSubmit: (data: Omit<Ingrediente, "id">) => void,
) {
  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      es_alergeno: false,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre,
        descripcion: value.descripcion,
        es_alergeno: value.es_alergeno,
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (ingrediente) {
        form.setFieldValue("nombre", ingrediente.nombre);
        form.setFieldValue("descripcion", ingrediente.descripcion);
        form.setFieldValue("es_alergeno", ingrediente.es_alergeno);
      } else {
        form.setFieldValue("nombre", "");
        form.setFieldValue("descripcion", "");
        form.setFieldValue("es_alergeno", false);
      }
    }
  }, [ingrediente, isOpen,form]);

  return {
    form,
    esModoEditar: !!ingrediente,
    titulo: ingrediente ? "Editar Ingrediente" : "Nuevo Ingrediente",
  };
}
