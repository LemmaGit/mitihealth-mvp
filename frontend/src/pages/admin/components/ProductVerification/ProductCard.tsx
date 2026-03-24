import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { CheckCircle, XCircle, Eye, ImageIcon } from "lucide-react";
import type { Product } from "./types";

export const statusBadge: Record<string, { label: string; className: string }> = {
  pending: { label: "New Submission", className: "bg-primary/10 text-primary border-primary/20" },
  approved: { label: "Approved", className: "bg-secondary text-secondary-foreground" },
  rejected: { label: "Rejected", className: "bg-destructive text-destructive-foreground" },
};

export default function ProductCard({
  product,
  onView,
  onApprove,
  onReject,
  isPending
}: {
  product: Product;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  isPending?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-botanical hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden shrink-0">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="text-muted-foreground opacity-30" size={48} />
        )}
        <Badge className={`absolute left-3 top-3 border text-[10px] font-semibold uppercase tracking-widest ${statusBadge[product.status]?.className}`}>
          {statusBadge[product.status]?.label}
        </Badge>
      </div>
      
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold leading-tight">{product.name}</h3>
            <span className="ml-2 whitespace-nowrap text-sm font-bold">ETB {product.price}</span>
          </div>
          
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Supplier:</span>
            <span className="text-xs font-semibold">{product.supplier}</span>
          </div>

          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{product.ingredients}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/20 pt-3">
          <Button variant="outline" size="sm" className="h-8 flex-1 gap-1.5 text-xs px-2" onClick={onView}>
            <Eye size={14} /> Review
          </Button>
          {product.status === "pending" && (
            <>
              <Button size="sm" className="h-8 flex-1 gap-1 px-2 botanical-gradient text-primary-foreground text-xs" onClick={onApprove} disabled={isPending}>
                <CheckCircle size={14} /> Approve
              </Button>
              <Button variant="outline" size="sm" className="h-8 flex-1 gap-1 px-2 text-xs text-destructive hover:bg-destructive/10" onClick={onReject} disabled={isPending}>
                <XCircle size={14} /> Reject
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
