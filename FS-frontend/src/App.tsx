import Navbar from "./components/Navbar/Navbar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from "./router/AppRouter";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;
