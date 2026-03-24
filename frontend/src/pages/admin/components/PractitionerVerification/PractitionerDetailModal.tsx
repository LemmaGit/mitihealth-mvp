import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { CheckCircle, XCircle, MapPin, Clock, Video, MessageSquare, Phone } from "lucide-react";
import type { Practitioner } from "./types";
import { statusBadge } from "./PractitionerCard";

const consultationIcon: Record<string, React.ReactNode> = {
  "Video Call": <Video size={14} />,
  "Chat": <MessageSquare size={14} />,
  "Audio Call": <Phone size={14} />,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{children}</p>;
}

export default function PractitionerDetailModal({
  practitioner: p,
  onClose,
  onApprove,
  onReject,
  isPending
}: {
  practitioner: Practitioner | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog open={!!p} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {p && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Practitioner Review</DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={p.image} alt={p.name} />
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{p.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
                  <Badge variant="secondary" className={`${statusBadge[p.status]?.className} text-[10px]`}>
                    {statusBadge[p.status]?.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{p.specialty}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> Since {p.practicingSince}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <SectionLabel>About</SectionLabel>
              <p className="mt-1 text-sm text-foreground leading-relaxed">{p.bio || "No bio provided."}</p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <SectionLabel>Email</SectionLabel>
                <p className="mt-1 text-sm text-foreground">{p.email || "N/A"}</p>
              </div>
              {/* <div>
                <SectionLabel>Phone</SectionLabel>
                <p className="mt-1 text-sm text-foreground">{p.phone || "N/A"}</p>
              </div> */}
            </div>

            {p.specializations?.length > 0 && (
              <div className="mt-4">
                <SectionLabel>Specializations</SectionLabel>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {p.specializations.map((s) => (
                    <Badge key={s} variant="secondary" className="bg-primary/10 text-primary text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {p.conditionsTreated?.length > 0 && (
              <div className="mt-4">
                <SectionLabel>Conditions Treated</SectionLabel>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {p.conditionsTreated.map((c) => (
                    <Badge key={c} variant="secondary" className="bg-muted text-muted-foreground text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <SectionLabel>Consultation Types & Pricing</SectionLabel>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                {p.consultationTypes.map((ct) => (
                  <div key={ct.label} className={`rounded-lg border p-3 text-center ${ct.enabled ? "border-primary/20 bg-primary/5" : "border-border/30 bg-muted/30 opacity-50"}`}>
                    <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-foreground">
                      {consultationIcon[ct.label] || <Clock size={14} />} {ct.label}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{ct.enabled ? `${ct.fee} ETB` : "Disabled"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <SectionLabel>Weekly Availability</SectionLabel>
              <div className="mt-1.5 space-y-1.5">
                {p.availability?.length > 0 ? p.availability.map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                    <span className="font-medium text-foreground">{a.day}</span>
                    <span className="text-muted-foreground">{a.from} – {a.to}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground italic">No availability listed.</p>
                )}
              </div>
            </div>

            {p.status === "pending" && (
              <div className="mt-4 flex items-center gap-2 border-t border-border/20 pt-4">
                <Button className="flex-1 botanical-gradient text-primary-foreground" onClick={onApprove} disabled={isPending}>
                  <CheckCircle size={14} className="mr-1.5" /> Verify Practitioner
                </Button>
                <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10" onClick={onReject} disabled={isPending}>
                  <XCircle size={14} className="mr-1.5" /> Reject
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
