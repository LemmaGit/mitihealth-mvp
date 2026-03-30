import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAppApi } from "../../hooks/useAppApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Order {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images?: string[];
    imageUrls?: string[];
  };
  quantity: number;
  orderStatus: "placed" | "confirmed" | "shipped" | "completed";
  createdAt: string;
  patientId: string;
  patientInfo?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}


export default function SupplierOrders() {
  const navigate = useNavigate();
  const { supplier } = useAppApi();
  const [activeTab, setActiveTab] = useState<string>("Incoming");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["supplier", "orders"],
    queryFn: () => supplier.getSupplierOrders(),
  });

  console.log(orders);

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      supplier.updateOrderStatus(orderId, { status }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["supplier", "orders"] });
    },
    onError: () => {
      toast.error("Failed to update order status");
    }
  });

  const filtered = (orders as Order[])
    .filter((order) => {
      const isIncoming = order.orderStatus === "placed" || order.orderStatus === "confirmed" || order.orderStatus === "shipped";
      const isHistory = order.orderStatus === "completed";
      
      if (activeTab === "Incoming") return isIncoming;
      if (activeTab === "History") return isHistory;
      return true;
    })
    .filter((order) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        order.productId.name.toLowerCase().includes(q) ||
        order._id.toLowerCase().includes(q) ||
        order.patientInfo?.firstName?.toLowerCase().includes(q) ||
        order.patientInfo?.lastName?.toLowerCase().includes(q)
      );
    });

  const handleChatWithPatient = (patientId: string) => {
    navigate(`/messages?receiverId=${patientId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-muted text-muted-foreground border-border";
      case "confirmed":
        return "bg-blue-10 text-blue border-blue/20";
      case "shipped":
        return "bg-orange-10 text-orange border-orange/20";
      case "completed":
        return "bg-green-10 text-green border-green/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-muted-foreground";
      case "confirmed":
        return "bg-blue";
      case "shipped":
        return "bg-orange";
      case "completed":
        return "bg-green";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="mb-8 font-headline font-bold text-primary text-4xl tracking-tight">
          Orders
        </h1>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-border"
          />
        </div>
      </div>
      <section className="mb-10 ml-auto">
        <div className="flex md:flex-row flex-col justify-between md:items-end gap-4 max-w-fit">
          <div className="bg-card px-6 py-4 border border-border/30 rounded-2xl text-right shrink-0">
            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Total Active</p>
            <p className="font-display font-extrabold text-primary text-2xl">{filtered.length} Orders</p>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground text-sm">Loading orders...</p>
        </div>
      )}

      {/* Order Grid */}
      {!isLoading && (
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 && (
            <div className="flex flex-col justify-center items-center col-span-full bg-card shadow-sm py-20 border border-border/60 border-dashed rounded-2xl text-center">
              <MessageSquare className="mb-4 size-16 text-muted-foreground/30" />
              <p className="font-headline font-semibold text-foreground text-xl">No orders found</p>
              <p className="mt-2 max-w-sm text-muted-foreground text-sm">No orders match your current search criteria.</p>
            </div>
          )}
          {filtered.map((order) => (
            <div
              key={order._id}
              className="bg-card hover:shadow-sm p-6 border border-border/30 hover:border-primary/20 rounded-2xl transition-all duration-300"
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
                  {order.patientInfo && (
                    <p className="mt-1 text-muted-foreground text-xs">
                      {order.patientInfo.firstName} {order.patientInfo.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="gap-4 grid grid-cols-2 mb-6 py-4 border-border/20 border-y">
                <div>
                  <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Quantity</p>
                  <p className="font-semibold text-foreground text-sm">{order.quantity} Units</p>
                </div>
                <div>
                  <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(order.orderStatus)}`} />
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  className="rounded-xl w-full text-primary-foreground botanical-gradient" 
                  asChild
                >
                  <Link to={`${order._id}`}>View Order Details</Link>
                </Button>
                {order.patientId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full cursor-pointer"
                    onClick={() => handleChatWithPatient(order.patientId)}
                  >
                    <MessageSquare className="mr-1.5 w-3.5 h-3.5" />
                    Chat with Patient
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
