import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PractitionerCard from "../../components/PractitionerCard";
import { practitioners } from "../../data/practitioners";
import { Slider } from "../../components/ui/slider";

const specialtyOptions = [
  "All Specialties",
  "Metabolic Wellness",
  "Endocrine Support",
  "Digestive Health",
  "Skin Health",
  "Respiratory Health",
  "Immune Support",
  "Stress Management",
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [priceRange, setPriceRange] = useState([200, 800]);
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    return practitioners.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        p.specialties.includes(selectedSpecialty);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesSpecialty && matchesPrice;
    });
  }, [searchQuery, selectedSpecialty, priceRange]);

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
              placeholder="Search by name or specialty..."
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
            {/* Specialty Tags */}
            <div>
              <h3 className="font-headline font-semibold text-sm text-foreground mb-3">Specialty</h3>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      selectedSpecialty === spec
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
          {filtered.map((p) => (
            <PractitionerCard key={p.id} practitioner={p} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No practitioners match your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("All Specialties");
                  setPriceRange([200, 800]);
                }}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </>
  );
};

export default Index;
