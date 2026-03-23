import { Badge } from "../../ui/badge";
import { Eye, Bell, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import type { Product } from "./types";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-primary text-primary-foreground",
  "LOW STOCK": "bg-secondary text-secondary-foreground",
  INACTIVE: "bg-muted text-muted-foreground",
  "OUT OF STOCK": "bg-destructive text-destructive-foreground",
};

interface ProductCardProps {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

export function ProductCard({ product: p, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-botanical hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
        {p.imageUrls && p.imageUrls.length > 0 ? (
          <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="text-muted-foreground opacity-30" size={48} />
        )}
        <Badge className={`absolute left-3 top-3 ${statusColors[p.status]}`}>
          {p.status}
        </Badge>
        {p.verified && (
          <Badge className="absolute right-3 top-3 bg-primary/10 text-primary border-primary/20">
            Verified
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-display font-semibold leading-tight">{p.name}</h3>
          <span className="ml-2 whitespace-nowrap text-sm font-bold">{p.price}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{p.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Inventory</span>
            <p className={`text-sm font-semibold ${p.invColor}`}>{p.inv}</p>
          </div>
          <div className="flex gap-2">
            {p.status === "INACTIVE" && <Eye size={16} className="text-muted-foreground cursor-pointer" />}
            {p.status === "OUT OF STOCK" && <Bell size={16} className="text-muted-foreground cursor-pointer" />}
            <button onClick={() => onEdit(p)} className="text-muted-foreground hover:text-foreground transition-colors">
              <Pencil size={16} />
            </button>
            {p.status !== "INACTIVE" && (
              <button onClick={() => onDelete(p)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
