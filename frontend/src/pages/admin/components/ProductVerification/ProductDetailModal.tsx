import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../../components/ui/carousel";
import { CheckCircle, XCircle } from "lucide-react";
import type { Product } from "./types";
import { statusBadge } from "./ProductCard";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

export default function ProductDetailModal({
  product,
  onClose,
  onApprove,
  onReject,
  isPending
}: {
  product: Product | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{product.name}</DialogTitle>
            </DialogHeader>

            {/* Image Carousel */}
            <div className="relative mx-auto w-full max-w-md">
              <Carousel className="w-full" opts={{
                align: "start",
                loop: true,
              }}>
                <CarouselContent>
                  {product.images.map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="overflow-hidden rounded-xl border border-border/50">
                        <img src={img} alt={`${product.name} ${i + 1}`} className="aspect-square w-full object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-3" />
                <CarouselNext className="-right-3" />
              </Carousel>
            </div>

            {/* Details Grid */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={`${statusBadge[product.status]?.className} text-xs uppercase tracking-widest font-semibold`}>
                  {statusBadge[product.status]?.label}
                </Badge>
                <span className="font-display text-lg font-bold">ETB {product.price}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Supplier" value={product.supplier} />
                <DetailField label="Category" value={product.category} />
                <DetailField label="Weight / Volume" value={product.weight} />
                {/* <DetailField label="Storage" value={product.storage} /> */}
              </div>

              <DetailField label="Description" value={product.description} />
              <DetailField label="Key Ingredients" value={product.ingredients} />
              {/* <DetailField label="Dosage & Usage" value={product.dosage} /> */}
              {/* <DetailField label="Side Effects & Warnings" value={product.sideEffects} /> */}

              {product.status === "pending" && (
                <div className="flex items-center gap-2 pt-2">
                  <Button className="flex-1 botanical-gradient text-primary-foreground" onClick={onApprove} disabled={isPending}>
                    <CheckCircle size={14} className="mr-1.5" /> Approve
                  </Button>
                  <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10" onClick={onReject} disabled={isPending}>
                    <XCircle size={14} className="mr-1.5" /> Reject
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
