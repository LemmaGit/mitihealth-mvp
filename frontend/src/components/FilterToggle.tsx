import { Button } from "./ui/button";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterToggleProps {
  showFilters: boolean;
  onToggle: () => void;
  activeFilterCount: number;
}

export const FilterToggle = ({ showFilters, onToggle, activeFilterCount }: FilterToggleProps) => {
  return (
    <Button
      type="button"
      variant={showFilters ? "default" : "secondary"}
      className="h-12 shrink-0 rounded-xl font-headline font-semibold gap-2"
      onClick={onToggle}
    >
      {showFilters ? (
        <X className="size-4" />
      ) : (
        <SlidersHorizontal className="size-4" />
      )}
      Filters
      {!showFilters && activeFilterCount > 0 && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20 text-xs">
          {activeFilterCount}
        </span>
      )}
    </Button>
  );
};
