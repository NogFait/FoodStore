import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./features/auth/context/AuthContext";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {!hideNavbar && <Navbar />}
        <div className="flex">
          {!hideNavbar && <Sidebar />}
          <main className="flex-1 min-h-[calc(100vh-4rem)]">
            <AppRouter />
          </main>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
