import type { ReactNode } from "react";
import { cn } from "../lib/utils";

function Loader({
  isFullPage = false,
  className,
  children,
}: {
  isFullPage?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background",
        isFullPage ? "fixed inset-0 z-9999 h-screen w-screen" : "relative min-h-[400px] w-full",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Loader;
