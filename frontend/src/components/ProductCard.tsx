import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    subtitle?: string;
    image: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
  };
  navigate: () => void;
  addProduct: (product: any) => void;
}

function ProductCard({ product, navigate, addProduct }: ProductCardProps) {

  return (
    <Card 
      className="group overflow-hidden shadow-botanical transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full"
      onClick={navigate}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={200}
          height={200}
        />
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Badge 
              variant="secondary" 
              className="bg-background text-foreground px-4 py-2 text-sm font-semibold shadow-lg"
            >
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-headline text-lg font-bold leading-tight text-foreground line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/40 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {product.price}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              ETB
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            size="icon"
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              addProduct(product);
            }}
            className="h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
