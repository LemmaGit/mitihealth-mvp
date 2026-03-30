import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import kosoImg from "@/assets/koso-tincture.jpg";
import moringaImg from "@/assets/moringa-blend.jpg";
import balmImg from "@/assets/recovery-balm.jpg";

type OrderStatus = "COMPLETED" | "SHIPPED" | "PLACED" | "CANCELLED";

interface Order {
  id: string;
  name: string;
  orderId: string;
  date: string;
  quantity: string;
  price: string;
  status: OrderStatus;
  image: string;
}

const allOrders: Order[] = [
  { id: "1", name: "Koso Vitality Tincture", orderId: "#MH-94821", date: "October 24, 2023", quantity: "2 Bottles", price: "ETB 1,450.00", status: "COMPLETED", image: kosoImg },
  { id: "2", name: "Highlands Moringa Blend", orderId: "#MH-95012", date: "October 22, 2023", quantity: "3 Packs", price: "ETB 890.00", status: "SHIPPED", image: moringaImg },
  { id: "3", name: "Tenadam Recovery Balm", orderId: "#MH-95104", date: "October 20, 2023", quantity: "1 Unit", price: "ETB 620.00", status: "PLACED", image: balmImg },
  { id: "4", name: "Damiana Herbal Tea", orderId: "#MH-93201", date: "September 15, 2023", quantity: "5 Boxes", price: "ETB 1,200.00", status: "COMPLETED", image: kosoImg },
  { id: "5", name: "Black Seed Oil (Pure)", orderId: "#MH-92100", date: "August 30, 2023", quantity: "1 Bottle", price: "ETB 780.00", status: "COMPLETED", image: balmImg },
];

const statusColor: Record<OrderStatus, string> = {
  COMPLETED: "bg-primary/10 text-primary border-primary/20",
  SHIPPED: "bg-primary/10 text-primary border-primary/20",
  PLACED: "bg-muted text-muted-foreground border-border",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusDot: Record<OrderStatus, string> = {
  COMPLETED: "bg-primary",
  SHIPPED: "bg-primary",
  PLACED: "bg-muted-foreground",
  CANCELLED: "bg-destructive",
};

export default function PatientOrders() {
  const [orders, setOrders] = useState(allOrders);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "ongoing" | "completed">("all");
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(3);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const filtered = orders
    .filter((o) => {
      if (tab === "ongoing") return o.status === "SHIPPED" || o.status === "PLACED";
      if (tab === "completed") return o.status === "COMPLETED";
      return true;
    })
    .filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return o.name.toLowerCase().includes(q) || o.orderId.toLowerCase().includes(q);
    })
    .sort((a, b) => (sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));

  const visible = filtered.slice(0, visibleCount);
  const activeCount = orders.filter((o) => o.status === "SHIPPED" || o.status === "PLACED").length;

  const handleCancel = () => {
    if (!cancelTarget) return;
    setOrders((prev) => prev.map((o) => (o.id === cancelTarget.id ? { ...o, status: "CANCELLED" as OrderStatus } : o)));
    toast.success(`Order Cancelled: ${cancelTarget.name} has been cancelled.`);
    setCancelTarget(null);
  };

  const tabs = [
    { key: "all" as const, label: "All Orders" },
    { key: "ongoing" as const, label: "Ongoing" },
    { key: "completed" as const, label: "Completed" },
  ];

  return (
    <>
      <div className="mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-5xl">
        {/* Header */}
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="font-display font-bold text-foreground text-2xl md:text-3xl">My Orders</h1>
            <p className="mt-1 max-w-md text-muted-foreground text-sm">
              Track your botanical remedies and manage your prescription history in one place.
            </p>
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
                onClick={() => { setTab(t.key); setVisibleCount(3); }}
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

        {/* Order cards */}
        <div className="space-y-4 mt-6">
          {visible.length === 0 && (
            <div className="bg-card shadow-botanical p-12 rounded-xl text-center">
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          )}
          {visible.map((order) => (
            <div
              key={order.id}
              className="bg-card shadow-botanical hover:shadow-md p-4 sm:p-6 rounded-xl transition-shadow"
            >
              <div className="flex sm:flex-row flex-col sm:items-center gap-4">
                {/* Image */}
                <img
                  src={order.image}
                  alt={order.name}
                  className="rounded-lg w-20 h-20 object-cover shrink-0"
                  loading="lazy"
                  width={80}
                  height={80}
                />

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <h3 className="font-display font-bold text-foreground text-base sm:text-lg">{order.name}</h3>
                    <Badge variant="outline" className={`${statusColor[order.status]} shrink-0`}>
                      <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${statusDot[order.status]}`} />
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Order {order.orderId} • Placed {order.date}
                  </p>
                  <div className="flex gap-6 pt-1">
                    <div>
                      <span className="text-muted-foreground text-xs">Quantity</span>
                      <p className="font-semibold text-foreground text-sm">{order.quantity}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Price</span>
                      <p className="font-semibold text-foreground text-sm">{order.price}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col flex-wrap items-center sm:items-end gap-2 shrink-0">
                  {(order.status === "SHIPPED" || order.status === "PLACED") && (
                    <Button size="sm" className="text-primary-foreground botanical-gradient">
                      <MessageSquare className="mr-1.5 w-3.5 h-3.5" />
                      Chat with Supplier
                    </Button>
                  )}
                  {order.status === "PLACED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setCancelTarget(order)}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-muted-foreground text-sm">
              Showing {visible.length} of {filtered.length} orders
            </p>
            <button
              onClick={() => setVisibleCount((c) => c + 3)}
              className="flex items-center gap-1 font-medium text-foreground hover:text-primary text-sm"
            >
              Load Older Orders <ChevronDown className="w-4 h-4" />
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
              Are you sure you want to cancel <span className="font-semibold">{cancelTarget?.name}</span> ({cancelTarget?.orderId})? This action cannot be undone.
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
