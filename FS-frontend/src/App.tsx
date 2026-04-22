import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductosPage from "./pages/ProductosPage";
import CategoriasPage from "./pages/CategoriasPage";
import IngredientesPage from "./pages/IngredientesPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/categorias" replace />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/ingredientes" element={<IngredientesPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
