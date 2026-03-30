import { Skeleton } from "../../ui/skeleton";

interface ProductSkeletonProps {
  count?: number;
  variant?: "card" | "list";
}

export function ProductSkeleton({ count = 6, variant = "card" }: ProductSkeletonProps) {
  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-xl bg-surface-container-lowest p-4 shadow-botanical">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-lg bg-surface-container-low" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48 bg-surface-container-low" />
                <Skeleton className="h-3 w-64 bg-surface-container-low" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md bg-surface-container-low" />
                <Skeleton className="h-8 w-8 rounded-md bg-surface-container-low" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-botanical animate-pulse"
        >
          {/* Image area - using tonal layering instead of borders */}
          <div className="relative h-48 bg-surface-container-low flex items-center justify-center">
            <div className="absolute left-3 top-3">
              <Skeleton className="h-6 w-16 rounded-full bg-surface/80" />
            </div>
            <div className="absolute right-3 top-3">
              <Skeleton className="h-6 w-16 rounded-full bg-surface/80" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full bg-surface-container" />
          </div>

          {/* Content area */}
          <div className="p-4 space-y-3">
            {/* Title and price row */}
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 flex-1 bg-surface-container-low" />
              <Skeleton className="h-5 w-16 bg-surface-container-low" />
            </div>

            {/* Description lines */}
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-full bg-surface-container-low" />
              <Skeleton className="h-3 w-3/4 bg-surface-container-low" />
            </div>

            {/* Inventory and actions row */}
            <div className="mt-4 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-2 w-12 bg-surface-container-low" />
                <Skeleton className="h-4 w-16 bg-surface-container-low" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md bg-surface-container-low" />
                <Skeleton className="h-8 w-8 rounded-md bg-surface-container-low" />
                <Skeleton className="h-8 w-8 rounded-md bg-surface-container-low" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
