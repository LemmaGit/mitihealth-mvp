import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, Leaf, CheckCircle } from "lucide-react";
import { products } from "../../data/products";
import { useCart } from "../../contexts/CartContext";
// import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
    
        <div className="flex items-center justify-center pt-40">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
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
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              width={512}
              height={512}
            />
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
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-secondary fill-secondary" : "text-surface-container"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{product.price} ETB</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{product.originalPrice} ETB</span>
              )}
            </div>

            {/* Practitioner Recommended */}
            {product.practitionerRecommended && (
              <div className="bg-primary-fixed/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-primary font-medium">
                  Recommended by <span className="font-bold">{product.practitionerRecommended}</span>
                </p>
              </div>
            )}

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Benefits */}
            <div>
              <h3 className="font-headline font-semibold text-foreground mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((b) => (
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
                <p className="text-sm font-semibold text-foreground">{product.origin}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Weight</p>
                <p className="text-sm font-semibold text-foreground">{product.weight}</p>
              </div>
            </div>

            {/* Usage */}
            <div className="bg-surface-container-low rounded-xl p-5">
              <h4 className="font-headline font-semibold text-foreground text-sm mb-2">How to Use</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.usage}</p>
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
                disabled={!product.inStock}
                className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-headline font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </>
  );
};

export default ProductDetail;
