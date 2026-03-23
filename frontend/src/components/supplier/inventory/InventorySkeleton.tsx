import { Skeleton } from "../../ui/skeleton";
import { ProductSkeleton } from "./ProductSkeleton";

export function InventorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 bg-surface-container-low" />
          <Skeleton className="h-8 w-64 bg-surface-container-low" />
          <Skeleton className="h-4 w-80 bg-surface-container-low" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-48 bg-surface-container-low" />
          <Skeleton className="h-10 w-32 bg-primary/20" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-surface-container-lowest p-4 shadow-botanical"
          >
            <Skeleton className="h-3 w-24 bg-surface-container-low" />
            <Skeleton className="mt-2 h-8 w-16 bg-surface-container-low" />
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-1 rounded-lg bg-surface-container-low p-1 w-fit">
        {["All Products", "Verified", "Unverified"].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md bg-surface-container" />
        ))}
      </div>

      {/* Product grid skeleton */}
      <ProductSkeleton count={6} />

      {/* Pagination skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Skeleton className="h-4 w-48 bg-surface-container-low" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-9 rounded-md bg-surface-container-low" />
          <Skeleton className="h-9 w-9 rounded-md bg-surface-container-low" />
          <Skeleton className="h-9 w-9 rounded-md bg-surface-container-low" />
          <Skeleton className="h-9 w-9 rounded-md bg-surface-container-low" />
          <Skeleton className="h-9 w-9 rounded-md bg-surface-container-low" />
          <Skeleton className="h-9 w-9 rounded-md bg-surface-container-low" />
        </div>
      </div>
    </div>
  );
}