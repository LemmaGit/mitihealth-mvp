import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";

const Marketplace = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { product } = useAppApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;
  const { data = [], isLoading } = useQuery({
    queryKey: ["patient", "products"],
    queryFn: () => product.getAllProducts(),
  });
  const productCategories = useMemo(
    () => ["All", ...Array.from(new Set((data as any[]).map((p: any) => (p.ingredients?.[0] || "General"))))],
    [data],
  );

  const filtered = useMemo(() => {
    return (data as any[]).map((p: any) => ({
      ...p,
      id: p._id,
      subtitle: p.ingredients?.slice(0, 2).join(", ") || "Botanical product",
      category: p.ingredients?.[0] || "General",
      image: p.imageUrls?.[0] || "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800",
      inStock: p.inventory > 0,
      rating: 5,
      reviews: 0,
    })).filter((p: any) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);
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
            className="w-full bg-surface-container-lowest pl-12 pr-4 py-3.5 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
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
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}
          {paginated.map((product: any) => (
            <div
              key={product.id}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-botanical hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => navigate(`/marketplace/${product.id}`)}
            >
              <div className="aspect-square relative overflow-hidden bg-surface-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={512}
                  height={512}
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                    <span className="bg-surface-container-lowest text-foreground px-4 py-2 rounded-full text-sm font-bold">
                      Out of Stock
                    </span>
                  </div>
                )}
                {product.originalPrice && product.inStock && (
                  <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
                {product.practitionerRecommended && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-[10px] font-bold">
                    ✦ Recommended
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-headline font-bold text-foreground leading-tight">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.subtitle}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                  <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">{product.price}</span>
                    <span className="text-xs text-muted-foreground">ETB</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    disabled={!product.inStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(product as any);
                    //   toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
                    }}
                    className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-container transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
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
