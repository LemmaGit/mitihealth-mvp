import { useEffect, useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import PractitionerCard, { type PractitionerCardModel } from "../../components/PractitionerCard";
import { SearchBar } from "../../components/SearchBar";
import { FilterCard } from "../../components/FilterCard";
import { FilterToggle } from "../../components/FilterToggle";
import { Pagination } from "../../components/Pagination";
import { EmptyState } from "../../components/EmptyState";
import { formatSpecialization, PRACTITIONER_PLACEHOLDER_IMG, yearsPracticing } from "../../lib/practitionerDisplay";
import { cn } from "../../lib/utils";

const Index = () => {
  const { common } = useAppApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [yearsExperience, setYearsExperience] = useState<[number, number]>([0, 50]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const { data: practitioners = [], isLoading } = useQuery({
    queryKey: ["patient", "practitioners"],
    queryFn: () =>
      common.getPractitioners({
        search: debouncedSearchQuery,
      } as Record<string, string | number | undefined>),
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const filtered = useMemo(() => {
    const rows: PractitionerCardModel[] = practitioners.map((p: Record<string, unknown>) => ({
      id: p.clerkId as string,
      title: formatSpecialization(p.specialization as string),
      location: (p.location as string) || "Ethiopia",
      specialties: (p.conditionsTreated as string[]) || [],
      yearsExp: yearsPracticing(p.practicingSinceEC as number),
      image: PRACTITIONER_PLACEHOLDER_IMG,
      verified: p.verificationStatus === "approved",
      ...(p.clerkInfo as any || {}),
    }));

    const q = debouncedSearchQuery.toLowerCase().trim();
    return rows.filter((p) => {
      const matchesSearch = !q || (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.specialties.some((s: string) => s.toLowerCase().includes(q)) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
      );
      
      const matchesExperience = p.yearsExp >= yearsExperience[0];
      
      return matchesSearch && matchesExperience;
    });
  }, [practitioners, debouncedSearchQuery, yearsExperience]);


  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (yearsExperience[0] !== 0 || yearsExperience[1] !== 50) count++;
    if (debouncedSearchQuery) count++;
    return count;
  }, [yearsExperience, debouncedSearchQuery]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setYearsExperience([0, 50]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <>
      <header className="mb-8 md:mb-10">
        <h1 className="font-headline font-bold text-primary text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Find Your Practitioner
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground text-base md:text-lg">
          Connect with verified clinical herbalists and traditional medicine experts.
        </p>
      </header>

      <div className="flex md:flex-row flex-col md:justify-start md:items-center gap-4 mb-6">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
        <FilterToggle
          showFilters={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {showFilters && (
      <div className={cn(
        "mb-8 transition-all duration-300 ease-in-out",
        "md:block md:max-w-md lg:max-w-lg"
      )}>
        <FilterCard
          yearsExperience={yearsExperience}
          onYearsExperienceChange={setYearsExperience}
          onClearFilters={clearAllFilters}
        />
      </div>
      )}

      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          Showing{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          practitioner{filtered.length !== 1 ? "s" : ""}
          {activeFilterCount > 0 && (
            <span className="ml-2 text-xs">
              • {activeFilterCount} active filter{activeFilterCount !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <div className="flex justify-center col-span-full py-12">
            <div className="text-muted-foreground text-sm">Loading practitioners...</div>
          </div>
        )}
        {!isLoading &&
          paginated.map((p: PractitionerCardModel) => (
            <PractitionerCard key={p.id} practitioner={p} />
          ))}
        {!isLoading && filtered.length === 0 && (
          <EmptyState onClearFilters={clearAllFilters} />
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Index;
