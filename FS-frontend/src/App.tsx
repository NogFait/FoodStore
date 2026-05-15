import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {!hideNavbar && <Navbar />}
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
