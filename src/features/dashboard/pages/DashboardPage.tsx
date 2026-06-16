import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useResumen,
  useVentasPorPeriodo,
  useProductosMasVendidos,
  useVentasPorCategoria,
  usePedidosPorEstado,
} from "../hooks/useEstadisticas";
import { StatCard } from "../components/StatCard";
import { ChartSkeleton } from "../components/ChartSkeleton";
import type { Agrupacion } from "../services/estadisticasService";

const PIE_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
];

function formatCurrency(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(n) ? "-" : `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function toDate(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split("T")[0];
}

const DashboardPage = () => {
  const [agrupacion, setAgrupacion] = useState<Agrupacion>("dia");
  const [desde, setDesde] = useState(() => toDate(30));
  const [hasta, setHasta] = useState(() => toDate(0));

  const resumen = useResumen();
  const ventasPeriodo = useVentasPorPeriodo(desde, hasta, agrupacion);
  const topProductos = useProductosMasVendidos(10);
  const ventasCategoria = useVentasPorCategoria();
  const pedidosEstado = usePedidosPorEstado();

  const lineData = (ventasPeriodo.data ?? []).map((v) => ({
    periodo: v.periodo,
    total: parseFloat(v.total),
    pedidos: v.cantidad_pedidos,
  }));

  const barData = (topProductos.data ?? []).map((p) => ({
    nombre: p.nombre.length > 18 ? p.nombre.slice(0, 16) + "…" : p.nombre,
    cantidad: p.cantidad_vendida,
    ingresos: parseFloat(p.ingresos),
  }));

  const pieData = (ventasCategoria.data ?? []).map((c) => ({
    name: c.categoria,
    value: parseFloat(c.total),
  }));

  const estadoData = (pedidosEstado.data ?? []).map((e, i) => ({
    name: e.estado,
    value: e.cantidad,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Resumen de actividad del negocio</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Pedidos"
            value={resumen.data?.total_pedidos ?? 0}
            loading={resumen.isLoading}
          />
          <StatCard
            label="Ventas Totales"
            value={resumen.data ? formatCurrency(resumen.data.ventas_totales) : "-"}
            loading={resumen.isLoading}
          />
          <StatCard
            label="Ticket Promedio"
            value={resumen.data ? formatCurrency(resumen.data.ticket_promedio) : "-"}
            loading={resumen.isLoading}
          />
          <StatCard
            label="Pedidos Pendientes"
            value={resumen.data?.pedidos_pendientes ?? 0}
            loading={resumen.isLoading}
          />
          <StatCard
            label="Productos Activos"
            value={resumen.data?.productos_activos ?? 0}
            loading={resumen.isLoading}
          />
        </div>

        {/* Line Chart — Ventas por período */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Ventas por período</h2>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Desde</label>
                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Hasta</label>
                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <select
                value={agrupacion}
                onChange={(e) => setAgrupacion(e.target.value as Agrupacion)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="dia">Por día</option>
                <option value="mes">Por mes</option>
              </select>
            </div>
          </div>

          {ventasPeriodo.isLoading ? (
            <div className="animate-pulse bg-gray-100 rounded-lg w-full h-72" />
          ) : lineData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
              Sin datos para el período seleccionado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={288}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="periodo"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${v.toLocaleString("es-AR")}`}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === "total"
                      ? [formatCurrency(Number(value)), "Ventas"]
                      : [value, "Pedidos"]
                  }
                  labelStyle={{ color: "#374151", fontWeight: 600 }}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <Legend formatter={(v) => (v === "total" ? "Ventas ($)" : "Cantidad pedidos")} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="pedidos"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bottom row: BarChart + PieCharts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart — Productos más vendidos */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Productos más vendidos</h2>
            {topProductos.isLoading ? (
              <ChartSkeleton title="" height={288} />
            ) : barData.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
                Sin datos disponibles
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={288}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="nombre"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "ingresos"
                        ? [formatCurrency(Number(value)), "Ingresos"]
                        : [value, "Vendidos"]
                    }
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  <Legend formatter={(v) => (v === "cantidad" ? "Unidades vendidas" : "Ingresos ($)")} />
                  <Bar dataKey="cantidad" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="ingresos" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Charts column */}
          <div className="flex flex-col gap-6">
            {/* Pie — Ventas por categoría */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Por categoría</h2>
              {ventasCategoria.isLoading ? (
                <div className="animate-pulse bg-gray-100 rounded-lg w-full h-40" />
              ) : pieData.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                  Sin datos
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCurrency(Number(value)), "Ventas"]}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) =>
                        value.length > 14 ? value.slice(0, 12) + "…" : value
                      }
                      wrapperStyle={{ fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie — Pedidos por estado */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Por estado</h2>
              {pedidosEstado.isLoading ? (
                <div className="animate-pulse bg-gray-100 rounded-lg w-full h-40" />
              ) : estadoData.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                  Sin datos
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={estadoData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      nameKey="name"
                    >
                      {estadoData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
