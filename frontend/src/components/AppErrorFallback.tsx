import { AlertTriangle } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { AppError } from "../lib/errors";

export function AppErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const resolved = error instanceof AppError ? error : null;
  const message = resolved?.message || "Something unexpected happened.";

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-botanical">
        <div className="mb-4 flex items-center gap-2 text-destructive">
          <AlertTriangle size={20} />
          <h2 className="font-display text-xl font-bold">Something went wrong</h2>
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
        {resolved?.code && (
          <p className="mt-2 text-xs text-muted-foreground">Error code: {resolved.code}</p>
        )}
        <div className="mt-6 flex items-center gap-3">
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            onClick={resetErrorBoundary}
          >
            Try again
          </button>
          <button
            className="rounded-lg border border-border/50 px-4 py-2 text-sm"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.assign("/");
              }
            }}
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

export function RouterErrorFallback() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-destructive">Route Error</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.status} - {error.statusText}
        </p>
      </div>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-destructive">Route Error</h1>
      <p className="mt-2 text-sm text-muted-foreground">Unknown route error.</p>
    </div>
  );
}
