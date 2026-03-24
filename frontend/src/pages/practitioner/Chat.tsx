import { useState } from "react";
import { useAppApi } from "../../hooks/useAppApi";
import { useQuery } from "@tanstack/react-query";

export default function Chat() {
  const { practitioner } = useAppApi();
  const [page, setPage] = useState(1);
  const perPage = 8;
  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ["practitioner", "consultations"],
    queryFn: () => practitioner.getMyConsultations(),
  });
  const rows = consultations as any[];
  const totalPages = Math.ceil(rows.length / perPage) || 1;
  const paginated = rows.slice((page - 1) * perPage, page * perPage);

  const join = (c: any) => {
    if (c.consultationType === "chat") {
      window.location.assign(`/patient/messages?practitionerId=${c.patientId}`);
      return;
    }
    if (c.jitsiRoom) window.open(`https://meet.jit.si/${c.jitsiRoom}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-primary">My Consultations</h1>
      {isLoading && <p className="text-sm text-muted-foreground">Loading consultations...</p>}
      <div className="grid gap-3">
        {paginated.map((c: any) => (
          <div key={c._id} className="rounded-xl bg-card p-4 shadow-botanical">
            <p className="text-sm font-medium">{c.consultationType.toUpperCase()} consultation</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(c.consultationDate).toLocaleString()} • {c.consultationTime}</p>
            <button onClick={() => join(c)} className="mt-3 text-sm text-primary">Join</button>
          </div>
        ))}
      </div>
      {rows.length > 0 && (
        <div className="flex items-center justify-between">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="text-sm">Previous</button>
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
