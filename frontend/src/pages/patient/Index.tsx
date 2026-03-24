import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PractitionerCard from "../../components/PractitionerCard";
import { Slider } from "../../components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";

const Index = () => {
  const { common } = useAppApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([200, 800]);
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const { data: practitioners = [], isLoading } = useQuery({
    queryKey: ["patient", "practitioners", selectedCondition, location, priceRange[0], priceRange[1]],
    queryFn: () =>
      common.getPractitioners({
        condition: selectedCondition !== "All Conditions" ? selectedCondition : undefined,
        location: location || undefined,
        minFee: priceRange[0],
        maxFee: priceRange[1],
      } as any),
  });

  const filtered = useMemo(() => {
    return practitioners
      .map((p: any) => ({
        id: p.clerkId,
        name: p.clerkId,
        title: p.specialization || "Practitioner",
        specialties: p.conditionsTreated || [],
        yearsExp: Math.max(0, new Date().getFullYear() - Number(p.practicingSinceEC || new Date().getFullYear())),
        consultations: 0,
        rating: 5,
        price: p.consultationTypes?.video?.price || p.consultationTypes?.audio?.price || p.consultationTypes?.chat?.price || 0,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
        verified: p.verificationStatus === "approved",
      }))
      .filter((p: any) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specialties.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [practitioners, searchQuery]);

  const conditionOptions = useMemo(() => {
    const all = new Set<string>();
    (practitioners as any[]).forEach((p) =>
      (p.conditionsTreated || []).forEach((c: string) => all.add(c)),
    );
    return ["All Conditions", ...Array.from(all)];
  }, [practitioners]);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    
      <>
        <header className="mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight mb-2">
            Find Your Practitioner
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with verified clinical herbalists and traditional medicine experts.
          </p>
        </header>

        {/* Search + Filter Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest pl-12 pr-4 py-3.5 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-surface-container-low text-primary font-headline font-semibold text-sm hover:bg-surface-container transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-surface-container-low rounded-2xl p-6 mb-8 space-y-6">
            <div>
              <h3 className="font-headline font-semibold text-sm text-foreground mb-3">Location</h3>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or area"
                className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div>
              <h3 className="font-headline font-semibold text-sm text-foreground mb-3">Condition</h3>
              <div className="flex flex-wrap gap-2">
                {conditionOptions.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedCondition(spec)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      selectedCondition === spec
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-surface-container-lowest text-muted-foreground hover:text-primary hover:bg-surface-container"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline font-semibold text-sm text-foreground">Price Range</h3>
                <span className="text-sm font-medium text-primary">
                  {priceRange[0]} – {priceRange[1]} ETB
                </span>
              </div>
              <Slider
                min={100}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">100 ETB</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">1000 ETB</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filtered.length}</span> practitioner{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Practitioner List */}
        <div className="space-y-5">
          {isLoading && <p className="text-sm text-muted-foreground">Loading practitioners...</p>}
          {paginated.map((p: any) => (
            <PractitionerCard key={p.id} practitioner={p} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No practitioners match your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCondition("All Conditions");
                  setLocation("");
                  setPriceRange([200, 800]);
                }}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <button className="text-sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p: number) => p - 1)}>
              Previous
            </button>
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
            <button className="text-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p: number) => p + 1)}>
              Next
            </button>
          </div>
        )}
      </>
  );
};

export default Index;
