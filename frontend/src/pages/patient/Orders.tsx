import { PatientLayout } from "../../components/layouts/PatientLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowRight, Check, Truck, Package, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const steps = [
  { label: "Placed", done: true },
  { label: "Confirmed", done: true },
  { label: "Shipped", done: true, current: true },
  { label: "Completed", done: false },
];

const previousOrders = [
  { id: "#MH-7712-24", date: "Sep 12, 2023", items: "Damiana Tea, Chamomile...", price: "ETB 890.00", status: "COMPLETED" },
  { id: "#MH-5421-23", date: "Aug 28, 2023", items: "Rosehip Extract (50ml)", price: "ETB 420.00", status: "COMPLETED" },
  { id: "#MH-4990-23", date: "Jul 15, 2023", items: "Nettle Leaf (Bulk), Elderberry", price: "ETB 2,100.00", status: "COMPLETED" },
];

export default function PatientOrders() {
  return (
    <PatientLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        {/* Header */}
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Order History</span>
          <h1 className="mt-1 font-display text-2xl font-bold text-primary md:text-3xl">Your Botanical Journey</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Review your prescribed herbal remedies and wellness essentials. Track your orders as they make their way from our gardens to your home.
          </p>
        </div>

        {/* Current order tracking */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-xl bg-card p-6 shadow-botanical">
            <div className="flex flex-wrap gap-8">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Order Number</span>
                <p className="mt-1 font-display text-lg font-bold">#MH-8829-24</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Order Date</span>
                <p className="mt-1 text-sm font-medium">Oct 24, 2023</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Amount</span>
                <p className="mt-1 font-display text-lg font-bold text-primary">ETB 1,450.00</p>
              </div>
              <Badge className="self-start bg-primary/10 text-primary">In Transit</Badge>
            </div>

            {/* Progress steps */}
            <div className="mt-8 flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step.label} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && <div className={`h-0.5 flex-1 ${step.done ? "bg-primary" : "bg-border"}`} />}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        step.current
                          ? "bg-primary text-primary-foreground"
                          : step.done
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.done ? (
                        step.current ? <Truck size={18} /> : <Check size={18} />
                      ) : (
                        <Package size={18} />
                      )}
                    </div>
                    {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${steps[i + 1]?.done ? "bg-primary" : "bg-border"}`} />}
                  </div>
                  <span className="mt-2 text-xs font-medium text-muted-foreground">{step.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="botanical-gradient text-primary-foreground">Track Package</Button>
              <Button variant="outline" className="border-border/30">Order Details</Button>
            </div>
          </div>

          {/* Items in order */}
          <div className="rounded-xl bg-card p-5 shadow-botanical">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Items in Order</h3>
            <div className="mt-4 space-y-4">
              {[
                { name: "Moringa & Ginger Blend", qty: 2 },
                { name: "Black Seed Oil (Pure)", qty: 1 },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs italic text-muted-foreground">
              "Nature's wisdom, delivered with clinical precision."
            </p>
          </div>
        </div>

        {/* Previous orders */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Previous Orders</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              View All Archives <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl bg-card shadow-botanical">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider">Order ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Items</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Price</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {previousOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell className="text-muted-foreground">{order.items}</TableCell>
                    <TableCell className="font-semibold text-primary">{order.price}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/20 text-primary">{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <FileText size={16} className="text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
