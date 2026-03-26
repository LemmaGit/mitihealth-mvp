import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  [key: string]: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    Promise.resolve().then(() => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        const currentQuantity = existing ? existing.quantity : 0;
        const newQuantity = currentQuantity + quantity;
        const maxStock = product.inventory || 0;
        
        if (newQuantity > maxStock) {
          toast.error(`Cannot add more than ${maxStock} items of ${product.name}`);
          return prev;
        }
        
        if (existing) {
          toast.success(`Added ${quantity} more ${product.name} to cart`);
          return prev.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        
        toast.success(`Added ${product.name} to cart`);
        return [...prev, { product, quantity }];
      });
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    Promise.resolve().then(() => {
      setItems((prev) => {
        const item = prev.find((i) => i.product.id === productId);
        if (item) {
          toast.success(`Removed ${item.product.name} from cart`);
        }
        return prev.filter((i) => i.product.id !== productId);
      });
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    Promise.resolve().then(() => {
      setItems((prev) => {
        const item = prev.find((i) => i.product.id === productId);
        if (!item) return prev;
        
        const maxStock = item.product.inventory || 0;
        
        if (quantity > maxStock) {
          toast.error(`Cannot add more than ${maxStock} items of ${item.product.name}`);
          return prev;
        }
        
        if (quantity <= 0) {
          toast.success(`Removed ${item.product.name} from cart`);
          return prev.filter((i) => i.product.id !== productId);
        }
        
        const oldQuantity = item.quantity;
        setItems((prevItems) =>
          prevItems.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
        );
        
        if (quantity > oldQuantity) {
          toast.success(`Increased ${item.product.name} quantity to ${quantity}`);
        } else {
          toast.success(`Decreased ${item.product.name} quantity to ${quantity}`);
        }
        
        return prev;
      });
    });
  }, []);

  const clearCart = useCallback(() => {
    Promise.resolve().then(() => setItems([]));
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
