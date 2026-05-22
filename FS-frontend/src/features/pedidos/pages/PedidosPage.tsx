const PedidosPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Pedidos</h1>
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500 text-lg">No hay pedidos entrantes.</p>
        <p className="text-gray-400 text-sm mt-2">
          Los pedidos de los clientes aparecerán acá para gestionar su estado.
        </p>
      </div>
    </div>
  );
};

export default PedidosPage;
