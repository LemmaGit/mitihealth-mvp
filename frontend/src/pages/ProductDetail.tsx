import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Star, Minus, Plus, ShoppingCart, Heart, ChevronRight } from "lucide-react";
import { useState } from "react";

const reviews = [
  { text: "The aroma is unlike anything else. It immediately clears my sinuses and has a wonderful peppery finish.", name: "Abinet T.", initials: "AT" },
  { text: "A staple in my tea cabinet. Excellent quality, you can tell it's fresh and well-processed.", name: "Henok D.", initials: "HD" },
  { text: "Perfect for after-dinner digestion. Love the connection to the Ethiopian highlands.", name: "Sarah M.", initials: "SM" },
];

const complementary = [
  { name: "Tena Adam Seeds", price: "520 ETB" },
  { name: "Bale Honey Infusion", price: "650 ETB" },
  { name: "Abyssinian Mint", price: "290 ETB" },
  { name: "Red Rosehip Blend", price: "410 ETB" },
];

export default function ProductDetail() {
  const [qty, setQty] = useState(1);

  return (
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Shop</span>
          <ChevronRight size={12} />
          <span>Herbal Teas</span>
          <ChevronRight size={12} />
          <span className="text-foreground">Kaffa Highland Koseret</span>
        </nav>

        {/* Product hero */}
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Badge className="absolute bottom-4 left-4 bg-foreground/80 text-background">
                ETHICALLY HARVESTED
              </Badge>
            </div>
            <div className="mt-3 flex gap-3">
              <div className="h-20 w-20 rounded-lg bg-muted" />
              <div className="h-20 w-20 rounded-lg bg-muted" />
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Lippia Abyssinica</span>
            <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">
              Kaffa Highland Koseret
            </h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">4.8 (104 Reviews)</span>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-foreground">
              450 <span className="text-base font-normal text-muted-foreground">ETB</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A botanical treasure from the mist-covered peaks of Kaffa. Sustainably harvested Lippia abyssinica, traditionally revered for digestive clarity and respiratory vitality.
            </p>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["Respiratory", "Digestive"].map((b) => (
                <div key={b} className="rounded-lg bg-muted p-3 text-center">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{b}</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {b === "Respiratory" ? "Supports lung clarity" : "Aids absorption"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-muted p-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Immune Antioxidants</span>
              <p className="mt-1 text-xs text-muted-foreground">Rich in bioactive polyphenols for daily resilience</p>
            </div>

            {/* Qty + Cart */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg bg-muted">
                <button className="px-3 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button className="px-3 py-2" onClick={() => setQty(qty + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <Button className="h-12 flex-1 botanical-gradient text-primary-foreground">
                <ShoppingCart size={16} /> ADD TO CART
              </Button>
            </div>
            <button className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Heart size={16} /> Save to Apothecary
            </button>
          </div>
        </div>

        {/* Preparation & Usage */}
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-secondary" />
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-secondary">Preparation & Usage</h2>
            <div className="h-px flex-1 bg-secondary" />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">The Art of Steeping</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  For the purest essence, steep one level teaspoon in water just off the boil (90°C) for exactly 6 minutes. This releases the peppery volatile oils without introducing bitterness.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Ritual & Frequency</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Best enjoyed as a post-meal ritual. The Koseret compounds work synergistically with your digestive system to ease absorption and refresh the palate.
                </p>
              </div>
            </div>

            {/* Heritage story card */}
            <div className="rounded-xl botanical-gradient p-6 text-primary-foreground">
              <h3 className="font-display text-xl font-bold">The Heritage Story</h3>
              <p className="mt-3 text-sm italic leading-relaxed text-primary-foreground/80">
                "In the cloud forests of Kaffa, Koseret has been prized for centuries. Our harvesters use traditional methods that preserve the root system, ensuring the forest thrives for future generations."
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Wild Harvested
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Ancient Wisdom
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Composition */}
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-secondary" />
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-secondary">Composition</h2>
            <div className="h-px flex-1 bg-secondary" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted p-5">
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Single Botanical</span>
              <p className="mt-2 font-display text-lg font-bold">100% Organic</p>
              <p className="text-sm text-muted-foreground">Lippia abyssinica</p>
            </div>
            <div className="rounded-xl bg-muted p-5">
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Origin Profile</span>
              <p className="mt-2 font-display text-lg font-bold">Kaffa Highland</p>
              <p className="text-sm text-muted-foreground">Forest • Ethiopia</p>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold italic">Community Reflections</h2>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                Trusted by 1,200+ Botanical Enthusiasts
              </p>
            </div>
            <Button variant="outline" className="border-border/30">
              Write Review ✏️
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-xl bg-card p-5 shadow-botanical">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {r.initials}
                  </div>
                  <span className="text-xs text-muted-foreground">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Complementary */}
        <section className="mt-16 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Complementary Remedies</h2>
            <button className="text-sm font-medium text-primary hover:underline">View Shop</button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {complementary.map((c) => (
              <div key={c.name}>
                <div className="aspect-square rounded-2xl bg-muted" />
                <h4 className="mt-3 text-sm font-medium">{c.name}</h4>
                <p className="text-xs text-muted-foreground">{c.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
  );
}
