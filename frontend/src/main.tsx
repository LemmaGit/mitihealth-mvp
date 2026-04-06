import { StrictMode} from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/react";
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "react-error-boundary";
import { AppErrorFallback } from "./components/AppErrorFallback";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.status && [400, 401, 403, 404].includes(error.status)) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      useErrorBoundary: false,
    },
  },
});

if (!PUBLISHABLE_KEY) throw new Error("Missing Clerk key");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} 
    afterSignOutUrl="/login"
    signInUrl="/login"
    signUpUrl="/signup"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={AppErrorFallback}>
                  <App />
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
);
