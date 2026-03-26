import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import ProductCard from "../../components/ProductCard";

const Marketplace = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { product } = useAppApi();
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;
  const { data = [], isLoading } = useQuery({
    queryKey: ["patient", "products"],
    queryFn: () => product.getAllProducts(),
  });
  // const productCategories = useMemo(
  //   () => ["All", ...Array.from(new Set((data as any[]).map((p: any) => (p.ingredients?.[0] || "General"))))],
  //   [data],
  // );

  const filtered = useMemo(() => {
    return (data as any[]).map((p: any) => ({
      ...p,
      id: p._id,
      subtitle: p.ingredients?.slice(0, 2).join(", ") || "Botanical product",
      category: p.ingredients?.[0] || "General",
      image: p.imageUrls?.[0] || "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800",
      inStock: p.inventory > 0,
    })).filter((p: any) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      // const matchesCategory =
      //   selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch;
    });
  }, [data, searchQuery]);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  return (
      
      <>
        <header className="mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight mb-2">
            Botanical Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Ethically sourced herbs, supplements, and remedies from Ethiopia's botanical heritage.
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-8 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-border bg-surface-container-lowest pl-12 pr-4 py-3.5 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Categories */}
        {/* <div className="flex flex-wrap gap-2 mb-8">
          {productCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-surface-container-lowest text-muted-foreground hover:text-primary hover:bg-surface-container"
              }`}
            >
              {cat}
            </button>
          ))}
        </div> */}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}
          {paginated.map((product: any) => (<ProductCard key={product.id} product={product} navigate={() => navigate(`${product.id}`)} addProduct={()=>addItem(product as any)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found.</p>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="col-span-full mt-6 flex items-center justify-between">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="text-sm">Previous</button>
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="text-sm">Next</button>
          </div>
        )}
      </>
   
  );
};

export default Marketplace;
