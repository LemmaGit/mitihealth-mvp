import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, Shield, Loader2 } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useMutation } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { patient } = useAppApi();

  const deliveryFee = items.length > 0 ? 50 : 0;
  const grandTotal = totalPrice + deliveryFee;

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
      toast.success("Order placed. Payment coming soon.");
      clearCart();
      navigate("/patient/orders");
    },
    onError: (err: any) => toast.error(err.message || "Failed to place order"),
  });

  const handleOrder = () => {
    orderMutation.mutate();
  };

  return (
      <>
        <button
          onClick={() => navigate("/patient/marketplace")}
          className="flex items-center gap-2 mb-8 font-medium text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>

        <h1 className="mb-8 font-headline font-bold text-primary text-4xl tracking-tight">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="space-y-4 py-20 text-center">
            <ShoppingCart className="opacity-30 mx-auto w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Your cart is empty.</p>
            <button
              onClick={() => navigate("/patient/marketplace")}
              className="bg-primary hover:bg-primary-container px-6 py-3 rounded-xl font-headline font-bold text-primary-foreground transition-all"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="gap-10 grid grid-cols-1 lg:grid-cols-12">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-8">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-5 bg-surface-container-lowest shadow-botanical p-5 rounded-2xl">
                  <div
                    className="bg-surface-container rounded-xl w-24 h-24 overflow-hidden cursor-pointer shrink-0"
                    onClick={() => navigate(`/patient/marketplace/${product.id}`)}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" width={96} height={96} />
                  </div>
                  <div className="flex flex-col flex-1 justify-between min-w-0">
                    <div>
                      <h3
                        className="font-headline font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                        onClick={() => navigate(`/patient/marketplace/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-xs">{product.weight}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="flex justify-center items-center hover:bg-surface-container rounded-md w-8 h-8 text-foreground transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 font-bold text-foreground text-sm text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="flex justify-center items-center hover:bg-surface-container rounded-md w-8 h-8 text-foreground transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-primary">{(product.price * quantity).toLocaleString()} ETB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="self-start hover:bg-destructive/10 p-2 rounded-lg text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="top-28 sticky space-y-6 bg-surface-container-lowest shadow-botanical p-6 rounded-3xl">
                <h3 className="font-headline font-bold text-foreground text-xl">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{totalPrice.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee.toFixed(2)} ETB</span>
                  </div>
                  <div className="tibeb-divider" />
                  <div className="flex justify-between font-bold text-foreground text-lg">
                    <span>Total</span>
                    <span>{grandTotal.toLocaleString()} ETB</span>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={orderMutation.isPending || items.length === 0}
                  className="flex justify-center items-center gap-3 bg-primary hover:bg-primary-container disabled:opacity-50 py-4 rounded-xl w-full font-headline font-bold text-primary-foreground text-lg transition-all disabled:cursor-not-allowed"
                >
                  {orderMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </button>
                <p className="text-muted-foreground text-xs text-center">
                  Payment processed securely via Telebirr & Chapa
                </p>
              </div>
            </div>
          </div>
        )}
      </>
  );
};

export default Cart;
