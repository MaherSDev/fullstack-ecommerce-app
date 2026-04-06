import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Provider as ChakraProvider } from "./components/ui/provider.tsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistor, store } from "./app/store.ts";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ChakraProvider>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </ChakraProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>,
);
