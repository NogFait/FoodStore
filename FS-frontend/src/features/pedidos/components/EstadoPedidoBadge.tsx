import type { EstadoPedidoOut } from "../types";

const COLORS: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMADO: "bg-blue-100 text-blue-800 border-blue-300",
  EN_PREPARACION: "bg-orange-100 text-orange-800 border-orange-300",
  LISTO_PARA_RETIRAR: "bg-purple-100 text-purple-800 border-purple-300",
  ENVIADO: "bg-indigo-100 text-indigo-800 border-indigo-300",
  ENTREGADO: "bg-green-100 text-green-800 border-green-300",
  CANCELADO: "bg-red-100 text-red-800 border-red-300",
};

type Props = {
  estado: EstadoPedidoOut;
  size?: "sm" | "md";
};

const EstadoPedidoBadge = ({ estado, size = "sm" }: Props) => {
  const color = COLORS[estado.codigo] ?? "bg-gray-100 text-gray-800 border-gray-300";
  const sizing =
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${color} ${sizing}`}
    >
      {estado.nombre}
    </span>
  );
};

export default EstadoPedidoBadge;
