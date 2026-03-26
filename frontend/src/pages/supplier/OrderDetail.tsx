import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Truck, Package, MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useAppApi } from "../../hooks/useAppApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Order {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images?: string[];
    description?: string;
  };
  quantity: number;
  orderStatus: "placed" | "confirmed" | "shipped" | "completed";
  createdAt: string;
  patientId: string;
  patientInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  supplierId?: string;
}

const statuses = ["placed", "confirmed", "shipped", "completed"] as const;

const statusConfig = {
  placed: { label: "Placed", icon: Package },
  confirmed: { label: "Confirmed", icon: CheckCircle },
  shipped: { label: "Shipped", icon: Truck },
  completed: { label: "Completed", icon: Package },
};

export default function SupplierOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { supplier } = useAppApi();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["supplier", "order", id],
    queryFn: () => supplier.getOrderDetails(id!),
    enabled: !!id,
  });
console.log(order)
  const statusMutation = useMutation({
    mutationFn: (status: string) => supplier.updateOrderStatus(id!, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier", "order", id] });
      queryClient.invalidateQueries({ queryKey: ["supplier", "orders"] });
      toast.success("Status Updated", {
        description: `Order #${id?.slice(-8)} status has been updated.`,
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to update order status. Please try again.",
      });
    }
  });

  if (!id) {
    return (
      <div className="flex flex-col justify-center items-center py-24 text-center">
        <p className="font-semibold text-foreground text-lg">Order not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/supplier/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground text-sm">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center py-24 text-center">
        <p className="font-semibold text-foreground text-lg">Order not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/supplier/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const currentStatus = (order as Order).orderStatus;
  const currentIdx = statuses.indexOf(currentStatus as typeof statuses[number]);

  const handleStatusChange = (status: string) => {
    const newIdx = statuses.indexOf(status as typeof statuses[number]);
    if (newIdx <= currentIdx) return; // can't go backward
    statusMutation.mutate(status);
  };

  const handleChatWithPatient = () => {
    navigate(`/messages?receiverId=${(order as Order).patientId}`);
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/supplier/orders")}
          className="hover:bg-muted p-2 rounded-full text-muted-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display font-bold text-foreground text-xl">Order #{(order as Order)._id.slice(-8)}</h1>
      </div>

      <div className="space-y-8 mx-auto max-w-3xl">
        {/* Order summary card */}
        <section className="bg-card shadow-sm p-6 md:p-8 border border-border/20 rounded-2xl">
          <div className="flex md:flex-row flex-col gap-8">
            <div className="bg-muted shadow-inner mx-auto md:mx-0 rounded-2xl w-48 h-48 overflow-hidden shrink-0">
              <img 
                src={(order as Order).productId.imageUrls?.[0] || "/placeholder-product.jpg"} 
                alt={(order as Order).productId.name} 
                className="w-full h-full object-cover" 
                width={192} 
                height={192} 
              />
            </div>
            <div className="flex-1 space-y-5">
              <div>
                <h2 className="font-display font-bold text-foreground text-2xl md:text-3xl">{(order as Order).productId.name}</h2>
                <p className="mt-1 text-muted-foreground text-sm">Order placed by patient</p>
                {(order as Order).productId.description && (
                  <p className="mt-2 text-muted-foreground text-sm line-clamp-2">{(order as Order).productId.description}</p>
                )}
              </div>
              <div className="gap-y-5 grid grid-cols-2">
                <div>
                  <span className="block mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Quantity</span>
                  <p className="font-semibold text-foreground text-lg">{(order as Order).quantity} Units</p>
                </div>
                <div>
                  <span className="block mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Order Date</span>
                  <p className="font-medium text-foreground text-base">
                    {new Date((order as Order).createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* {(order as Order).patientInfo && (
                  <>
                    <div>
                      <span className="block mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Patient</span>
                      <p className="font-medium text-foreground text-base">
                        {(order as Order).patientInfo.firstName} {(order as Order).patientInfo.lastName}
                      </p>
                    </div>
                    {(order as Order).patientInfo.email && (
                      <div>
                        <span className="block mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Email</span>
                        <p className="font-medium text-foreground text-base">{(order as Order).patientInfo.email}</p>
                      </div>
                    )}
                  </>
                )} */}
              </div>
            </div>
          </div>
        </section>

        {/* Status controls */}
        <section className="bg-muted/30 p-6 md:p-8 border border-border/20 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-semibold text-foreground text-lg">Update Status</h3>
            <div className="flex gap-1.5">
              {statuses.map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    i <= currentIdx ? "bg-primary" : "bg-border/40"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="gap-3 md:gap-4 grid grid-cols-2 sm:grid-cols-4">
            {statuses.map((s, i) => {
              const cfg = statusConfig[s];
              const Icon = cfg.icon;
              const isActive = i <= currentIdx;
              const isCurrent = s === currentStatus;
              const isDisabled = i <= currentIdx;
              
              return (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={isDisabled}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center transition-all md:p-6 ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : isActive
                      ? "bg-primary/80 text-primary-foreground"
                      : "border border-border/30 bg-card text-muted-foreground hover:bg-muted opacity-50"
                  }`}
                >
                  <Icon className="w-6 md:w-7 h-6 md:h-7" />
                  <span className="font-bold text-[10px] md:text-[11px] uppercase tracking-tight">{cfg.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-muted-foreground text-xs text-center">
            Status changes are irreversible. Please confirm before updating.
          </p>
        </section>

        {/* Chat action */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-foreground hover:bg-foreground/90 shadow-xl py-6 rounded-2xl w-full max-w-sm text-background"
            onClick={handleChatWithPatient}
          >
            <MessageSquare className="mr-2 w-5 h-5" />
            <span className="font-display font-bold">Chat with Patient</span>
          </Button>
        </div>
      </div>
    </>
  );
}
