import { SupplierLayout } from "../../components/layouts/SupplierLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Download, Eye, AlertTriangle, Package, CheckCircle2, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const chartData = [
  { day: "MON", value: 3200 },
  { day: "TUE", value: 4100 },
  { day: "WED", value: 6800 },
  { day: "THU", value: 4500 },
  { day: "FRI", value: 5200 },
  { day: "SAT", value: 3800 },
  { day: "SUN", value: 4200 },
];

const alerts = [
  { icon: AlertTriangle, label: "Teff Grain Root", detail: "Only 5kg remaining", color: "text-secondary" },
  { icon: Package, label: "Dried Moringa", detail: "Restock arriving in 2 days", color: "text-muted-foreground" },
  { icon: CheckCircle2, label: "Boswellia Resin", detail: "Inventory levels healthy", color: "text-primary" },
];

const recentOrders = [
  { name: "Wild Ginger Extract", order: "#88392 • 2h ago", qty: "24 Units", status: "PROCESSING", total: "$450.00" },
  { name: "Sacred Myrrh Resin", order: "#88391 • 5h ago", qty: "10 kg", status: "TRANSIT", total: "$1,200.00" },
  { name: "Ethiopian Honey", order: "#88389 • Yesterday", qty: "50 Jars", status: "DELIVERED", total: "$875.00" },
];

const statusColor: Record<string, string> = {
  PROCESSING: "bg-secondary/20 text-secondary",
  TRANSIT: "bg-destructive/20 text-destructive",
  DELIVERED: "bg-primary/20 text-primary",
};

export default function SupplierDashboard() {
  return (
      <div className="space-y-8">
        {/* Hero banner + stat cards */}
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="relative overflow-hidden rounded-xl botanical-gradient p-8 text-primary-foreground">
            <span className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60">Monthly Performance</span>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
              Total Revenue:
              <br />$42,890.00
            </h2>
            <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">
              Your organic herbal sales have increased by 14% compared to last harvest season.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Download size={16} /> Download Report
              </Button>
              <Button className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                <Eye size={16} /> View Details
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-card p-5 shadow-botanical">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Package size={18} className="text-muted-foreground" />
                </div>
                <Badge className="bg-primary/10 text-primary text-xs">+3 New</Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Products Listed</p>
              <p className="font-display text-2xl font-bold">128</p>
            </div>
            <div className="rounded-xl bg-card p-5 shadow-botanical">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Package size={18} className="text-muted-foreground" />
                </div>
                <Badge className="bg-secondary/20 text-secondary text-xs">8 Pending</Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Active Orders</p>
              <p className="font-display text-2xl font-bold">34</p>
            </div>
          </div>
        </div>

        {/* Alerts + Chart */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-card p-6 shadow-botanical">
            <h3 className="font-display text-lg font-semibold">Inventory Alerts</h3>
            <div className="mt-4 space-y-4">
              {alerts.map((a) => (
                <div key={a.label} className="flex items-center justify-between rounded-lg p-3 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <a.icon size={18} className={a.color} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.detail}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              ))}
            </div>

            {/* Herbalist tip */}
            <div className="mt-6 rounded-xl botanical-gradient p-5 text-primary-foreground">
              <span className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60">Herbalist Tip</span>
              <p className="mt-2 text-sm leading-relaxed">
                Did you know? Moringa leaves retain more nutrients when stored in low-light, cool environments during transport.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-card p-6 shadow-botanical">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">Sales Performance</h3>
                  <p className="text-xs text-muted-foreground">Weekly revenue trends across all regions</p>
                </div>
                <div className="flex gap-1 text-xs">
                  {["7D", "30D", "1Y"].map((t, i) => (
                    <button
                      key={t}
                      className={`rounded-md px-3 py-1 ${i === 0 ? "bg-muted font-medium" : "text-muted-foreground"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(113 8% 76% / 0.3)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(160 5% 46%)" />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(150 63% 24% / 0.3)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent orders table */}
            <div className="rounded-xl bg-card p-6 shadow-botanical">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Recent Market Orders</h3>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">View Ledger</button>
              </div>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider">Item Details</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Quantity</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((o) => (
                    <TableRow key={o.name} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted" />
                          <div>
                            <p className="text-sm font-medium">{o.name}</p>
                            <p className="text-xs text-muted-foreground">Order {o.order}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{o.qty}</TableCell>
                      <TableCell>
                        <Badge className={statusColor[o.status]}>{o.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">{o.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
  );
}
