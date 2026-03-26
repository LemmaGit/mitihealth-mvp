import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Bell, Minus, Plus, Trash2, Shield, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useMutation } from "@tanstack/react-query";
import { useAppApi } from "../hooks/useAppApi";
import { toast } from "sonner";

const navLinks = [
  { label: "Dashboard", to: "/patient/dashboard" },
  { label: "Practitioners", to: "/patient" },
  { label: "Marketplace", to: "/patient/marketplace" },
  { label: "Messages", to: "/messages" },
];

const Navbar = () => {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, totalItems, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { patient } = useAppApi();

  const orderMutation = useMutation({
    mutationFn: async () => {
      for (const item of items) {
        await patient.createOrder({
          productId: (item.product as any)._id || item.product.id,
          quantity: item.quantity,
        });
      }
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      clearCart();
      setIsCartOpen(false);
    },
    onError: (err: any) => toast.error(err.message || "Failed to place order"),
  });

  return (
    <nav className="fixed top-0 w-full z-50 bg-primary-fixed/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tighter font-headline">
          Ethio-Botanica
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.to ||
              (link.to === "/patient" && location.pathname.startsWith("/patient/practitioner")) ||
              (link.to === "/patient" && location.pathname.startsWith("/patient/booking")) ||
              (link.to === "/patient/marketplace" && location.pathname.startsWith("/patient/marketplace")) ||
              (link.to === "/messages" && location.pathname === "/messages");
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-headline font-semibold tracking-tight transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 hover:bg-primary/5 rounded-lg transition-all text-primary relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          
          {isCartOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
              <div className="w-full sm:max-w-md h-full bg-background shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="font-headline text-2xl font-bold">Your Cart</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto opacity-30 mb-4" />
                      <p className="text-muted-foreground">Your cart is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {items.map(({ product, quantity }) => (
                          <div key={product.id} className="flex gap-4 p-3 rounded-xl bg-surface-container-lowest shadow-sm border border-border/50">
                            <img src={product.image} className="w-20 h-20 rounded-lg object-cover bg-surface-container" alt={product.name} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm truncate uppercase tracking-tight">{product.name}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{product.weight}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1">
                                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded text-foreground hover:bg-surface-container"><Minus className="w-3 h-3"/></button>
                                  <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                                  <button onClick={() => updateQuantity(product.id, Math.min(product.inventory || 99, quantity + 1))} className="w-6 h-6 flex items-center justify-center rounded text-foreground hover:bg-surface-container"><Plus className="w-3 h-3"/></button>
                                </div>
                                <span className="text-sm font-bold text-primary">{(product.price * quantity).toLocaleString()} ETB</span>
                              </div>
                            </div>
                            <button onClick={() => removeItem(product.id)} className="self-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/50 space-y-3">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Subtotal</span><span className="font-medium text-foreground">{totalPrice.toLocaleString()} ETB</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Delivery Fee</span><span className="font-medium text-foreground">50.00 ETB</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-3 border-t border-border/50 text-foreground">
                          <span>Total</span><span className="text-primary">{(totalPrice + 50).toLocaleString()} ETB</span>
                        </div>
                        <button 
                          onClick={() => orderMutation.mutate()} 
                          disabled={orderMutation.isPending} 
                          className="w-full mt-4 bg-primary text-primary-foreground py-4 rounded-xl font-headline font-bold flex items-center justify-center gap-2 shadow-botanical hover:bg-primary/95 hover:shadow-lg disabled:opacity-50 transition-all"
                        >
                          <Shield className="w-5 h-5" />
                          {orderMutation.isPending ? "Processing..." : "Place Trusted Order"}
                        </button>
                        <p className="text-center text-xs text-muted-foreground mt-2">Orders are finalized securely upon placement.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <button className="p-2 hover:bg-primary/5 rounded-lg transition-all text-primary">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-10 w-10 rounded-full bg-primary-container overflow-hidden flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">AH</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
