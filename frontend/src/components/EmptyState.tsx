import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <Card className="border-dashed col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <SearchX className="mb-4 size-12 text-muted-foreground/50" />
        <p className="text-lg font-medium text-foreground">
          No practitioners found
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
        <Button
          variant="link"
          onClick={onClearFilters}
          className="mt-4"
        >
          Clear all filters
        </Button>
      </CardContent>
    </Card>
  );
};
