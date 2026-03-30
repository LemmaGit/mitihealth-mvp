import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative flex-1 md:max-w-2xl">
      <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by specialty, location, or condition..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border-border/60 bg-card pl-11 shadow-sm  md:max-w-2xl"
      />
    </div>
  );
};
