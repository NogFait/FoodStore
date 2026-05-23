import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import type { Direccion } from "../types";

export function useDireccionForm(
  direccion: Direccion | null,
  onSubmit: (data: Omit<Direccion, "id" | "usuario_id">) => void,
) {
  const form = useForm({
    defaultValues: {
      alias: "",
      linea1: "",
      linea2: "",
      ciudad: "",
      provincia: "",
      codigo_postal: "",
      latitud: undefined as number | undefined,
      longitud: undefined as number | undefined,
      es_principal: false,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        alias: value.alias,
        linea1: value.linea1,
        linea2: value.linea2 || undefined,
        ciudad: value.ciudad,
        provincia: value.provincia,
        codigo_postal: value.codigo_postal,
        latitud: value.latitud || undefined,
        longitud: value.longitud || undefined,
        es_principal: value.es_principal,
      });
    },
  });

  useEffect(() => {
    if (direccion) {
      form.setFieldValue("alias", direccion.alias);
      form.setFieldValue("linea1", direccion.linea1);
      form.setFieldValue("linea2", direccion.linea2 || "");
      form.setFieldValue("ciudad", direccion.ciudad);
      form.setFieldValue("provincia", direccion.provincia);
      form.setFieldValue("codigo_postal", direccion.codigo_postal);
      form.setFieldValue("latitud", direccion.latitud ?? undefined);
      form.setFieldValue("longitud", direccion.longitud ?? undefined);
      form.setFieldValue("es_principal", direccion.es_principal);
    } else {
      form.setFieldValue("alias", "");
      form.setFieldValue("linea1", "");
      form.setFieldValue("linea2", "");
      form.setFieldValue("ciudad", "");
      form.setFieldValue("provincia", "");
      form.setFieldValue("codigo_postal", "");
      form.setFieldValue("latitud", undefined);
      form.setFieldValue("longitud", undefined);
      form.setFieldValue("es_principal", false);
    }
  }, [direccion,form]);

  return {
    form,
    esModoEditar: !!direccion,
    titulo: direccion ? "Editar Dirección" : "Nueva Dirección",
  };
}
