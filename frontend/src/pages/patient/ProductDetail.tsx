import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, Leaf, CheckCircle } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { product: productApi } = useAppApi();
  const [activeImage, setActiveImage] = useState(0);
  const { data: products = [] } = useQuery({
    queryKey: ["patient", "products"],
    queryFn: () => productApi.getAllProducts(),
  });
  const product = (products as any[]).find((p: any) => p._id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
    
        <div className="flex items-center justify-center pt-40">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      ...product,
      id: product._id,
      image: product.imageUrls?.[0] || "",
      inStock: (product.inventory || 0) > 0,
      weight: `${product.inventory || 0} in stock`,
      usage: product.usageInstructions?.join(", ") || "See label",
    } as any, quantity);
    // toast({ title: "Added to cart!", description: `${quantity}x ${product.name} added to your cart.` });
  };

  return (
  
      <>
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/marketplace")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container">
            <img
              src={product.imageUrls?.[activeImage] || product.imageUrls?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              width={512}
              height={512}
            />
          </div>
          <div className="flex gap-2 mt-3">
            {(product.imageUrls || []).map((img: string, i: number) => (
              <button key={img} onClick={() => setActiveImage(i)} className={`h-16 w-16 overflow-hidden rounded-lg ${activeImage === i ? "ring-2 ring-primary" : ""}`}>
                <img src={img} alt={product.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-label uppercase tracking-widest text-secondary">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground mt-1">
                {product.name}
              </h1>
              <p className="text-muted-foreground mt-1">{product.subtitle}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 5 ? "text-secondary fill-secondary" : "text-surface-container"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">5.0</span>
              <span className="text-sm text-muted-foreground">(verified)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{product.price} ETB</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{product.originalPrice} ETB</span>
              )}
            </div>

            {/* Practitioner Recommended */}
            <div className="bg-primary-fixed/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-primary font-medium">Verified marketplace product</p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Benefits */}
            <div>
              <h3 className="font-headline font-semibold text-foreground mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                {(product.ingredients || []).map((b: string) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Leaf className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Origin</p>
                <p className="text-sm font-semibold text-foreground">Ethiopia</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Weight</p>
                <p className="text-sm font-semibold text-foreground">{product.inventory || 0} in stock</p>
              </div>
            </div>

            {/* Usage */}
            <div className="bg-surface-container-low rounded-xl p-5">
              <h4 className="font-headline font-semibold text-foreground text-sm mb-2">How to Use</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{(product.usageInstructions || []).join(", ") || "Refer to packaging instructions."}</p>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-all text-foreground"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-all text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.inventory <= 0}
                className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-headline font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </>
  );
};

export default ProductDetail;
