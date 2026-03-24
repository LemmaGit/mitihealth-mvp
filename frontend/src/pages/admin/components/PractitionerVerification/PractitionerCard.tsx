import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { CheckCircle, XCircle, Eye, MapPin, Calendar } from "lucide-react";
import type { Practitioner } from "./types";

export const statusBadge: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-primary/10 text-primary border-primary/20" },
  approved: { label: "Verified", className: "bg-secondary text-secondary-foreground uppercase" },
  rejected: { label: "Rejected", className: "bg-destructive text-destructive-foreground uppercase" },
};

export default function PractitionerCard({
  practitioner: p,
  onView,
  onApprove,
  onReject,
  isPending
}: {
  practitioner: Practitioner;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  isPending?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-botanical hover:shadow-lg transition-shadow flex flex-col justify-between">
      {/* Top Banner section */}
      <div className="relative h-28 bg-muted/60 botanical-gradient w-full flex items-center justify-center shrink-0">
         <Badge className={`absolute left-3 top-3 border text-[10px] font-semibold uppercase tracking-widest ${statusBadge[p.status]?.className}`}>
          {statusBadge[p.status]?.label}
        </Badge>
        {/* Substantially large Avatar overlaps bounding box */}
        <Avatar className="absolute -bottom-8 left-4 h-20 w-20 shrink-0 border-4 border-card shadow-sm">
          <AvatarImage src={p.image} alt={p.name} className="object-cover bg-white" />
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{p.initials}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="p-4 pt-10 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground leading-tight">{p.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{p.specialty}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {p.dateApplied}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 flex-wrap border-t border-border/20 pt-3">
          <Button variant="outline" size="sm" className="h-8 flex-1 gap-1.5 text-xs px-2" onClick={onView}>
            <Eye size={14} /> Review
          </Button>
          {p.status === "pending" && (
            <>
              <Button size="sm" className="h-8 flex-1 gap-1 px-2 botanical-gradient text-primary-foreground text-xs" onClick={onApprove} disabled={isPending}>
                <CheckCircle size={14} /> Verify
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
