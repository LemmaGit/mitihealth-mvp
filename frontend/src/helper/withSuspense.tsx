import { Suspense, ComponentType, LazyExoticComponent } from "react";
import { HashLoader } from "react-spinners";
import Loader from "../components/Loader";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { AppErrorFallback } from "../components/AppErrorFallback";

export const withSuspense = (
  Component: LazyExoticComponent<ComponentType<any>>,
  isFullPage = false
) => {
  return function SuspendedComponent(props: any) {
    return (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={AppErrorFallback}>
            <Suspense
              fallback={
                <Loader isFullPage={isFullPage}>
                  <HashLoader color="#166534" />
                </Loader>
              }
            >
              <Component {...props} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    );
  };
};

