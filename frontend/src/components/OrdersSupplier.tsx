import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


import moringaImg from "@/assets/moringa-extract.jpg";
import echinaceaImg from "@/assets/echinacea-tincture.jpg";
import blackSeedImg from "@/assets/black-seed-oil.jpg";
import greenTeaImg from "@/assets/green-tea-powder.jpg";
import berbereImg from "@/assets/berbere-mix.jpg";
import aloeImg from "@/assets/aloe-vera-gel.jpg";

const orders = [
  { id: "MH-88293", name: "Moringa Oleifera Extract", date: "Oct 24, 2023", quantity: 12, total: "$456.00", image: moringaImg, status: "confirmed" as const },
  { id: "MH-88294", name: "Organic Echinacea Tincture", date: "Oct 23, 2023", quantity: 5, total: "$128.50", image: echinaceaImg, status: "confirmed" as const },
  { id: "MH-88295", name: "Raw Black Seed Oil", date: "Oct 22, 2023", quantity: 25, total: "$890.00", image: blackSeedImg, status: "shipped" as const },
  { id: "MH-88296", name: "Premium Green Tea Powder", date: "Oct 24, 2023", quantity: 50, total: "$1,200.00", image: greenTeaImg, status: "confirmed" as const },
  { id: "MH-88297", name: "Berbere Botanical Mix", date: "Oct 23, 2023", quantity: 10, total: "$320.00", image: berbereImg, status: "delivered" as const },
  { id: "MH-88298", name: "Aloe Vera Healing Gel", date: "Oct 24, 2023", quantity: 2, total: "$45.00", image: aloeImg, status: "confirmed" as const },
];

const tabs = ["Incoming", "History", "Returns"] as const;

export default function Fulfillment() {
  const [activeTab, setActiveTab] = useState<string>("Incoming");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
<>
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="font-display font-bold text-foreground text-xl">Orders</h1>
          <nav className="hidden md:flex items-center gap-4 ml-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 font-display text-sm font-semibold tracking-tight transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="mb-10">
        <div className="flex md:flex-row flex-col justify-between md:items-end gap-4">
          <div>
            <span className="block mb-2 font-bold text-[10px] text-primary uppercase tracking-[0.15em]">
              Supply Chain Management
            </span>
            <h2 className="font-display font-bold text-foreground text-3xl md:text-4xl leading-tight tracking-tight">
              Active Fulfillment
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground text-sm">
              Monitor and process botanical prescriptions for patient fulfillment.
            </p>
          </div>
          <div className="flex-shrink-0 bg-card px-6 py-4 border border-border/30 rounded-2xl text-right">
            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Total Active</p>
            <p className="font-display font-extrabold text-primary text-2xl">{filtered.length} Orders</p>
          </div>
        </div>
      </section>

      {/* Order Grid */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="bg-card hover:shadow-sm p-6 border border-border/30 hover:border-primary/20 rounded-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 bg-muted rounded-xl w-16 h-16 overflow-hidden">
                <img
                  src={order.image}
                  alt={order.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={64}
                  height={64}
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-sm leading-tight">{order.name}</h3>
                <p className="mt-1 text-muted-foreground text-xs">{order.date}</p>
              </div>
            </div>
            <div className="gap-4 grid grid-cols-2 mb-6 py-4 border-border/20 border-y">
              <div>
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Quantity</p>
                <p className="font-semibold text-foreground text-sm">{order.quantity} Units</p>
              </div>
              <div>
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Total Paid</p>
                <p className="font-semibold text-foreground text-sm">{order.total}</p>
              </div>
            </div>
            <Button className="rounded-xl w-full text-primary-foreground botanical-gradient" asChild>
              <Link to={`/supplier/fulfillment/${order.id}`}>View Fulfillment Details</Link>
            </Button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-muted-foreground text-center">
          <MessageSquare className="opacity-40 mx-auto mb-3 w-10 h-10" />
          <p className="text-sm">No orders found matching your search.</p>
        </div>
      )}

      {/* Heritage divider */}
      <div className="mt-16">
        <div className="heritage-divider" />
        <p className="mt-4 font-bold text-[10px] text-muted-foreground text-center uppercase tracking-[0.2em]">
          MitiHealth botanical supply chain systems
        </p>
      </div>
      </>
  );
}
