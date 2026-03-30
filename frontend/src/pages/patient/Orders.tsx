import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Search, MessageSquare, ChevronDown, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import { useAppApi } from "../../hooks/useAppApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type OrderStatus = "placed" | "confirmed" | "shipped" | "completed";

interface Order {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images?: string[];
    imageUrls?: string[];
    supplierId?: string;
  };
  quantity: number;
  orderStatus: OrderStatus;
  createdAt: string;
  patientId: string;
  supplierId?: string;
}

const statusColor: Record<OrderStatus, string> = {
  placed: "bg-muted text-muted-foreground border-border",
  confirmed: "bg-primary/10 text-primary border-primary/20",
  shipped: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

const statusDot: Record<OrderStatus, string> = {
  placed: "bg-muted-foreground",
  confirmed: "bg-primary",
  shipped: "bg-primary",
  completed: "bg-primary",
};

export default function PatientOrders() {
  const navigate = useNavigate();
  const { patient } = useAppApi();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "ongoing" | "completed">("all");
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(6);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["patient", "orders"],
    queryFn: () => patient.getMyOrders(),
  });

  console.log(orders,"----");
  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => patient.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", "orders"] });
      toast.success("Order Cancelled", {
        description: "Your order has been cancelled successfully."
      });
      setCancelTarget(null);
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to cancel order. Please try again."
      });
    }
  });

  const filtered = (orders as Order[])
    .filter((o) => {
      if (tab === "ongoing") return o.orderStatus === "shipped" || o.orderStatus === "confirmed" || o.orderStatus === "placed";
      if (tab === "completed") return o.orderStatus === "completed";
      return true;
    })
    .filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return o.productId.name.toLowerCase().includes(q) || o._id.toLowerCase().includes(q);
    })
    .sort((a, b) => (sort === "oldest" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  const visible = filtered.slice(0, visibleCount);
  const activeCount = orders.filter((o: Order) => o.orderStatus === "shipped" || o.orderStatus === "confirmed" || o.orderStatus === "placed").length;

  const handleCancel = () => {
    if (!cancelTarget) return;
    cancelMutation.mutate(cancelTarget._id);
  };

  const handleChatWithSupplier = (order: Order) => {
    navigate(`/messages?receiverId=${order.productId.supplierId! || 'admin'}`);
  };

  const tabs = [
    { key: "all" as const, label: "All Orders" },
    { key: "ongoing" as const, label: "Ongoing" },
    { key: "completed" as const, label: "Completed" },
  ];

  return (
    <>
      <div className="mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-6xl">
        {/* Header */}
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="mb-8 font-headline font-bold text-primary text-4xl tracking-tight">
          My Orders
        </h1>
            
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search by product name or Order ID..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Active orders badge + tabs + sort */}
        <div className="flex sm:flex-row flex-col sm:items-center gap-4 mt-8">
          <div className="flex items-center gap-4 bg-primary px-5 py-3 rounded-xl text-primary-foreground">
            <div>
              <span className="opacity-80 font-semibold text-[10px] uppercase tracking-widest">Active Orders</span>
              <p className="font-display font-bold text-3xl leading-none">
                {String(activeCount).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setVisibleCount(6); }}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="bg-transparent shadow-none border-none w-[150px] h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by: Newest</SelectItem>
                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground text-sm">Loading orders...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col justify-center items-center bg-card shadow-sm py-20 border border-border/60 border-dashed rounded-2xl text-center">
            <ShoppingCart className="mb-4 size-16 text-muted-foreground/30" />
            <p className="font-headline font-semibold text-foreground text-xl">No orders yet</p>
            <p className="mt-2 mb-6 max-w-sm text-muted-foreground text-sm">You haven't placed any orders.</p>
            <Button 
              onClick={() => navigate('/patient/marketplace')}
              className="inline-flex justify-center items-center bg-primary hover:bg-primary/90 shadow-sm px-6 py-3 rounded-xl font-semibold text-primary-foreground text-sm transition-colors"
            >
              Browse Marketplace
            </Button>
          </div>
        )}

        {/* Order grid */}
        {!isLoading && orders.length > 0 && (
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mt-6">
            {visible.length === 0 && (
              <div className="col-span-full bg-card shadow-botanical p-12 rounded-xl text-center">
                <p className="text-muted-foreground">No orders found matching your criteria.</p>
              </div>
            )}
            {visible.map((order) => (
              <div
                key={order._id}
                className="bg-card shadow-botanical hover:shadow-md p-6 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-muted rounded-xl w-16 h-16 overflow-hidden shrink-0">
                    <img
                      src={order.productId.imageUrls?.[0] || "/placeholder-product.jpg"}
                      alt={order.productId.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground text-sm leading-tight">{order.productId.name}</h3>
                    <p className="mt-1 text-muted-foreground text-xs">Order #{order._id.slice(-8)}</p>
                  </div>
                </div>
                <div className="gap-4 grid grid-cols-2 mb-6 py-4 border-border/20 border-y">
                  <div>
                    <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Quantity</p>
                    <p className="font-semibold text-foreground text-sm">{order.quantity} Units</p>
                  </div>
                  <div>
                    <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
                    <Badge variant="outline" className={`${statusColor[order.orderStatus]} shrink-0`}>
                      <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${statusDot[order.orderStatus]}`} />
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {(order.orderStatus === "shipped" || order.orderStatus === "confirmed" || order.orderStatus === "placed") && (
                    <Button 
                      size="sm" 
                      className="w-full text-primary-foreground cursor-pointer botanical-gradient"
                      onClick={() => handleChatWithSupplier(order)}
                    >
                      <MessageSquare className="mr-1.5 w-3.5 h-3.5" />
                      Chat with Supplier
                    </Button>
                  )}
                  {order.orderStatus === "placed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => setCancelTarget(order)}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {!isLoading && visibleCount < filtered.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 3)}
              className="flex items-center gap-1 px-4 py-2 border border-border hover:border-primary rounded-lg font-medium text-foreground hover:text-primary text-sm transition-colors"
            >
              Load More Orders <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel <span className="font-semibold">{cancelTarget?.productId.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
