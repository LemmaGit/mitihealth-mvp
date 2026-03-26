import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Truck, Package, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


import moringaImg from "@/assets/moringa-extract.jpg";
import echinaceaImg from "@/assets/echinacea-tincture.jpg";
import blackSeedImg from "@/assets/black-seed-oil.jpg";
import greenTeaImg from "@/assets/green-tea-powder.jpg";
import berbereImg from "@/assets/berbere-mix.jpg";
import aloeImg from "@/assets/aloe-vera-gel.jpg";

const ordersData: Record<string, { name: string; image: string; quantity: number; price: string; date: string; status: string }> = {
  "MH-88293": { name: "Moringa Oleifera Extract", image: moringaImg, quantity: 25, price: "ETB 14,500.00", date: "Oct 24, 2023", status: "confirmed" },
  "MH-88294": { name: "Organic Echinacea Tincture", image: echinaceaImg, quantity: 5, price: "ETB 3,200.00", date: "Oct 23, 2023", status: "confirmed" },
  "MH-88295": { name: "Raw Black Seed Oil", image: blackSeedImg, quantity: 25, price: "ETB 22,250.00", date: "Oct 22, 2023", status: "shipped" },
  "MH-88296": { name: "Premium Green Tea Powder", image: greenTeaImg, quantity: 50, price: "ETB 30,000.00", date: "Oct 24, 2023", status: "confirmed" },
  "MH-88297": { name: "Berbere Botanical Mix", image: berbereImg, quantity: 10, price: "ETB 8,000.00", date: "Oct 23, 2023", status: "delivered" },
  "MH-88298": { name: "Aloe Vera Healing Gel", image: aloeImg, quantity: 2, price: "ETB 1,125.00", date: "Oct 24, 2023", status: "confirmed" },
};

const statuses = ["confirmed", "shipped", "delivered"] as const;

const statusConfig = {
  confirmed: { label: "Confirmed", icon: CheckCircle },
  shipped: { label: "Shipped", icon: Truck },
  delivered: { label: "Delivered", icon: Package },
};

export default function FulfillmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const order = id ? ordersData[id] : null;

  const [currentStatus, setCurrentStatus] = useState<string>(order?.status || "confirmed");

  if (!order) {
    return (
      <SupplierLayout>
        <div className="flex flex-col justify-center items-center py-24 text-center">
          <p className="font-semibold text-foreground text-lg">Order not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/supplier/fulfillment">Back to Fulfillment</Link>
          </Button>
        </div>
      </SupplierLayout>
    );
  }

  const currentIdx = statuses.indexOf(currentStatus as typeof statuses[number]);

  const handleStatusChange = (status: string) => {
    const newIdx = statuses.indexOf(status as typeof statuses[number]);
    if (newIdx < currentIdx) return; // can't go backward
    setCurrentStatus(status);
    toast({
      title: "Status Updated",
      description: `Order #${id} marked as ${statusConfig[status as keyof typeof statusConfig].label}.`,
    });
  };

  return (
   <>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/supplier/fulfillment")}
          className="hover:bg-muted p-2 rounded-full text-muted-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display font-bold text-foreground text-xl">Order #{id}</h1>
      </div>

      <div className="space-y-8 mx-auto max-w-3xl">
        {/* Order summary card */}
        <section className="bg-card shadow-sm p-6 md:p-8 border border-border/20 rounded-2xl">
          <div className="flex md:flex-row flex-col gap-8">
            <div className="flex-shrink-0 bg-muted shadow-inner mx-auto md:mx-0 rounded-2xl w-48 h-48 overflow-hidden">
              <img src={order.image} alt={order.name} className="w-full h-full object-cover" width={192} height={192} />
            </div>
            <div className="flex-1 space-y-5">
              <div>
                <h2 className="font-display font-bold text-foreground text-2xl md:text-3xl">{order.name}</h2>
                <p className="mt-1 text-muted-foreground text-sm">Order confirmed by pharmacy</p>
              </div>
              <div className="gap-y-5 grid grid-cols-2">
                <div>
                  <span className="block mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Quantity</span>
                  <p className="font-semibold text-foreground text-lg">{order.quantity} Units</p>
                </div>
                <div>
                  <span className="block mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Total Price</span>
                  <p className="font-semibold text-primary text-lg">{order.price}</p>
                </div>
                <div>
                  <span className="block mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Order Date</span>
                  <p className="font-medium text-foreground text-base">{order.date}</p>
                </div>
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
          <div className="gap-3 md:gap-4 grid grid-cols-3">
            {statuses.map((s, i) => {
              const cfg = statusConfig[s];
              const Icon = cfg.icon;
              const isActive = i <= currentIdx;
              const isCurrent = s === currentStatus;
              return (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={i < currentIdx}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center transition-all md:p-6 ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : isActive
                      ? "bg-primary/80 text-primary-foreground"
                      : "border border-border/30 bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-6 md:w-7 h-6 md:h-7" />
                  <span className="font-bold text-[10px] md:text-[11px] uppercase tracking-tight">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Chat action */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-foreground hover:bg-foreground/90 shadow-xl py-6 rounded-2xl w-full max-w-sm text-background"
            asChild
          >
            <Link to="/practitioner/chat" className="flex justify-center items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              <span className="font-display font-bold">Chat with Patient</span>
            </Link>
          </Button>
        </div>
      </div>
   </>
  );
}
