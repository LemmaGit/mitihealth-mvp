import { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import Loader from "../../components/Loader";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import PractitionerCard from "./components/PractitionerVerification/PractitionerCard";
import PractitionerDetailModal from "./components/PractitionerVerification/PractitionerDetailModal";
import type { Practitioner } from "./components/PractitionerVerification/types";
import { getInitials } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PractitionerVerification() {
  const { admin } = useAppApi();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState("pending");
  const [selected, setSelected] = useState<Practitioner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: rawData = [], isLoading: isPractitionersLoading } = useQuery({
    queryKey: ["admin", "practitioners"],
    queryFn: () => admin.getPractitioners(),
  });

  const { data: rawUsers = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => admin.getUsers(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => admin.verifyPractitioner(id, { status }),
    onSuccess: () => {
      toast.success("Practitioner verification status updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "practitioners"] });
      setSelected(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update practitioner status.");
    }
  });

  if (isPractitionersLoading || isUsersLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader isFullPage={false}><ClipLoader color="#004c22" /></Loader>
      </div>
    );
  }

  const userMap = new Map((rawUsers || []).map((u: any) => [u.clerkId, u]));

  const practitioners: Practitioner[] = (rawData || []).map((p: any) => {
    const user: any = userMap.get(p.clerkId) || {};
    const name = user.name || p.clerkId || "Unknown Practitioner";
    return {
      id: p._id,
      name,
      specialty: p.specialization || "General",
      location: p.location || "Not specified",
      dateApplied: new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      status: p.verificationStatus || "pending",
      image: user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      initials: getInitials(name),
      bio: p.bio || "",
      email: user.email || "N/A",
      practicingSince: p.practicingSinceEC || "N/A",
      specializations: p.specialization ? [p.specialization] : [],
      consultationTypes: [
        { label: "Video Call", fee: p.consultationTypes?.video?.price || 0, enabled: p.consultationTypes?.video?.enabled || false },
        { label: "Chat", fee: p.consultationTypes?.chat?.price || 0, enabled: p.consultationTypes?.chat?.enabled || false },
        { label: "Audio Call", fee: p.consultationTypes?.audio?.price || 0, enabled: p.consultationTypes?.audio?.enabled || false },
      ],
      availability: Array.isArray(p.availability) 
        ? p.availability
            .filter((d: any) => d.enabled !== false && d.slots?.length > 0)
            .flatMap((d: any) => d.slots.map((slot: any) => ({
              day: d.day,
              from: slot.start,
              to: slot.end
            })))
        : [],
      conditionsTreated: p.conditionsTreated || [],
    };
  });

  const filtered = practitioners.filter((p) => p.status === tab);
  const pendingCount = practitioners.filter((p) => p.status === "pending").length;
  const verifiedCount = practitioners.filter((p) => p.status === "approved").length;
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleVerify = (id: string, status: string) => {
    verifyMutation.mutate({ id, status });
  };

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Practitioner Applications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review credentials and verify practitioner profiles for the platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 px-3 py-1.5">
              <span className="text-xs font-semibold text-primary">Pending: {pendingCount}</span>
            </div>
            <div className="rounded-lg bg-primary/10 px-3 py-1.5">
              <span className="text-xs font-semibold text-primary">Verified: {verifiedCount}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(val) => { setTab(val); setCurrentPage(1); }}>
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              Pending
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1.5 bg-destructive/10 text-destructive text-[10px]">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Verified</TabsTrigger>
            <TabsTrigger value="rejected" className="text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Practitioner Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((p) => (
            <PractitionerCard 
              key={p.id} 
              practitioner={p} 
              onView={() => setSelected(p)} 
              onApprove={() => handleVerify(p.id, "approved")}
              onReject={() => handleVerify(p.id, "rejected")}
              isPending={verifyMutation.isPending}
            />
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/50 p-8 text-center text-muted-foreground">
            No applications found in this category.
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/15 pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} practitioners
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(c => Math.max(1, c - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <PractitionerDetailModal 
        practitioner={selected} 
        onClose={() => setSelected(null)} 
        onApprove={() => handleVerify(selected!.id, "approved")}
        onReject={() => handleVerify(selected!.id, "rejected")}
        isPending={verifyMutation.isPending}
      />
    </>
  );
}
