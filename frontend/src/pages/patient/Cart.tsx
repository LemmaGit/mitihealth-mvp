import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, Shield } from "lucide-react";
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
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>

        <h1 className="font-headline text-4xl font-bold text-primary tracking-tight mb-8">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto opacity-30" />
            <p className="text-muted-foreground text-lg">Your cart is empty.</p>
            <button
              onClick={() => navigate("/patient/marketplace")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-headline font-bold hover:bg-primary-container transition-all"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="bg-surface-container-lowest rounded-2xl p-5 flex gap-5 shadow-botanical">
                  <div
                    className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container shrink-0 cursor-pointer"
                    onClick={() => navigate(`/patient/marketplace/${product.id}`)}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" width={96} height={96} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3
                        className="font-headline font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/patient/marketplace/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{product.weight}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-container transition-all text-foreground"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-foreground">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-container transition-all text-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-primary">{(product.price * quantity).toLocaleString()} ETB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="self-start p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-surface-container-lowest rounded-3xl shadow-botanical p-6 sticky top-28 space-y-6">
                <h3 className="text-xl font-headline font-bold text-foreground">Order Summary</h3>

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
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>{grandTotal.toLocaleString()} ETB</span>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-headline font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3"
                >
                  <Shield className="w-5 h-5" />
                  Place Order
                </button>
                <p className="text-center text-xs text-muted-foreground">
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
