import { PatientLayout } from "../../components/layouts/PatientLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Plus, Video, MessageSquare, ArrowRight, ClipboardList, Leaf, XCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../../lib/utils";

const sessions = [
  {
    name: "Dr. Abebe Bekele",
    status: "PENDING",
    type: "Post-Treatment Follow-up",
    date: "Oct 28, 2023",
    color: "bg-secondary",
    actions: ["Reschedule", "Cancel"],
  },
  {
    name: "Hana Wolde",
    status: "CONFIRMED",
    type: "Digestive Health Consultation",
    date: "Nov 2, 2023",
    color: "bg-primary",
    actions: ["View Pre-Consult Notes"],
  },
  {
    name: "Dr. Selamawit Tadesse",
    status: "COMPLETED",
    type: "Initial Assessment",
    date: "Oct 15, 2023",
    color: "bg-muted-foreground",
    actions: ["Prescription"],
  },
  {
    name: "Marcus Chen",
    status: "CANCELLED",
    type: "Holistic Wellness Review",
    date: "Oct 10, 2023",
    color: "bg-destructive",
    actions: [],
    note: "Refund Processed",
  },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-secondary/20 text-secondary",
  CONFIRMED: "bg-primary/20 text-primary",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
};

const statusIcons: Record<string, any> = {
  PENDING: ClipboardList,
  CONFIRMED: Leaf,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

export default function PatientConsultations() {
  return (
    <PatientLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-primary">Patient Portal</span>
            <h1 className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">My Consultations</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Manage your upcoming appointments with certified herbal practitioners and access your clinical history.
            </p>
          </div>
          <Button className="botanical-gradient text-primary-foreground">
            <Plus size={16} /> Book New Consultation
          </Button>
        </div>

        {/* Active consultation + Sidebar */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Active card */}
          <div className="rounded-xl bg-card p-6 shadow-botanical">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">ACTIVE NOW</span>
              <span className="text-sm text-muted-foreground">Starts in 12 minutes</span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted" />
              <div>
                <h3 className="font-display text-lg font-semibold text-primary">Dr. Selamawit Tadesse</h3>
                <p className="text-sm text-muted-foreground">Senior Clinical Herbalist • Respiratory Specialist</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted p-3">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Date</span>
                <p className="mt-1 text-sm font-medium">Today, Oct 24</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Time</span>
                <p className="mt-1 text-sm font-medium">2:30 PM (EAT)</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button className="h-12 botanical-gradient text-primary-foreground">
                <Video size={16} /> Join Video
              </Button>
              <Button variant="outline" className="h-12 border-border/30">
                <MessageSquare size={16} /> Join Chat
              </Button>
            </div>
          </div>

          {/* Right sidebar cards */}
          <div className="space-y-4">
            <div className="rounded-xl bg-primary p-5 text-primary-foreground">
              <h4 className="font-display font-semibold">Prescription Ready</h4>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Your herbal blend from Dr. Bekele is ready for pickup at Marketplace.
              </p>
              <button className="mt-3 flex items-center gap-1 text-sm font-medium underline">
                View Details <ArrowRight size={14} />
              </button>
            </div>

            <div className="rounded-xl bg-card p-5 shadow-botanical">
              <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Consultation Summary</h4>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold tabular-nums">14</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Upcoming</span>
                  <span className="font-semibold tabular-nums">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cancelled</span>
                  <span className="font-semibold tabular-nums text-destructive">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions list */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold">Recent & Upcoming Sessions</h2>
          <div className="mt-6 space-y-3">
            {sessions.map((s) => {
              const Icon = statusIcons[s.status] || ClipboardList;
              return (
                <div
                  key={s.name + s.date}
                  className="flex flex-col gap-4 rounded-xl bg-card p-5 shadow-botanical sm:flex-row sm:items-center sm:justify-between"
                  style={{ borderLeft: `4px solid` }}
                  // Color the left border based on status
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Icon size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-semibold">{s.name}</span>
                        <Badge className={cn("text-[10px]", statusColors[s.status])}>
                          {s.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{s.type} • {s.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.actions.map((a) => (
                      <Button key={a} variant="outline" size="sm" className="border-border/30 text-xs">
                        {a}
                      </Button>
                    ))}
                    {s.note && <span className="text-xs italic text-muted-foreground">{s.note}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Did you know */}
        <div className="mt-12 rounded-xl bg-muted p-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="mt-0.5 text-primary" />
            <div>
              <h4 className="font-display font-semibold">Did you know?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                In traditional Ethiopian medicine, <em className="font-semibold">Kosso</em> (Hagenia abyssinica) is one of the most revered plants. Ensure you discuss any high-potency traditional remedies with your practitioner during video sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
