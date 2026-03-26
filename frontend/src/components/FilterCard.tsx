import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from "lucide-react";
import { useCallback, useMemo } from "react";

interface FilterCardProps {
  yearsExperience: [number, number];
  onYearsExperienceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export const FilterCard = ({
  yearsExperience,
  onYearsExperienceChange,
  onClearFilters,
}: FilterCardProps) => {
  const hasActiveFilters = useMemo(() => {
    return yearsExperience[0] !== 0 || yearsExperience[1] !== 50;
  }, [yearsExperience]);

  const handleYearsExperienceChange = useCallback((value: string) => {
    const [min, max] = value.split('-').map(Number);
    onYearsExperienceChange([min, max]);
  }, [onYearsExperienceChange]);

  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <span className="font-headline font-semibold text-foreground text-sm">
          Refine results
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1 h-7 text-muted-foreground hover:text-foreground text-xs"
          >
            <X className="size-3" />
            Clear all
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="font-semibold text-xs uppercase tracking-wider">
            Years of Experience Starting From
          </Label>
          <Select
            value={`${yearsExperience[0]}-${yearsExperience[1]}`}
            onValueChange={handleYearsExperienceChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select experience range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-50">All Experience Levels</SelectItem>
              <SelectItem value="0-5"> 0+ years</SelectItem>
              <SelectItem value="5-10"> 5+ years</SelectItem>
              <SelectItem value="10-15">10+ years</SelectItem>
              <SelectItem value="15-20">15+ years</SelectItem>
              <SelectItem value="20-30">20+ years</SelectItem>
              <SelectItem value="30-50">30+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};