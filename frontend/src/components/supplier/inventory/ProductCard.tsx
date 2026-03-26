import { Badge } from "../../ui/badge";
import { Eye, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
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
    <div className="bg-card shadow-botanical hover:shadow-lg rounded-xl overflow-hidden transition-shadow">
      <div className="relative flex justify-center items-center bg-muted h-48 overflow-hidden">
        {p.imageUrls && p.imageUrls.length > 0 ? (
          <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="opacity-30 text-muted-foreground" size={48} />
        )}
        <Badge className={`absolute left-3 top-3 ${statusColors[p.status]}`}>
          {p.status}
        </Badge>
        {p.verified && (
          <Badge className="top-3 right-3 absolute bg-primary/10 border-primary/20 text-primary">
            Verified
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-display font-semibold leading-tight">{p.name}</h3>
          <span className="ml-2 font-bold text-sm whitespace-nowrap">{p.price}</span>
        </div>
        <p className="mt-2 text-muted-foreground text-xs line-clamp-2">{p.desc}</p>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">Inventory</span>
            <p className={`text-sm font-semibold ${p.invColor}`}>{p.inv}</p>
          </div>
          <div className="flex gap-2">
            {p.status === "INACTIVE" && <Eye size={16} className="text-muted-foreground cursor-pointer" />}
            {/* {p.status === "OUT OF STOCK" && <Bell size={16} className="text-muted-foreground cursor-pointer" />} */}
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
