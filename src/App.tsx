import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router/AppRouter";
import AuthProvider from "./features/auth/context/AuthProvider";
import { Toaster, toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        toast.error(
          "Error: " +
            (error instanceof Error ? error.message : "Error desconocido"),
        );
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex">
          <main className="flex-1 min-h-[calc(100vh-4rem)]">
            <AppRouter />
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
