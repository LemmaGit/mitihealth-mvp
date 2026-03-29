import { useMemo, useState } from "react";
import { useAppApi } from "../../hooks/useAppApi";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ConsultationCard from "../../components/ConsultationCard";
import { getSessionDate } from "../../lib/utils";

export default function PatientConsultations() {
  const { patient } = useAppApi();
  const [page, setPage] = useState(1);
  const perPage = 9;
  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ["patient", "consultations"],
    queryFn: () => patient.getMyConsultations(),
  });

  const activeConsultations = useMemo(() => {
    return (consultations as any[]).filter(c => c.status === "booked" || c.status === "active");
  }, [consultations]);

  const sortedConsultations = useMemo(() => {
    return activeConsultations.sort((a, b) => {
      const aTime = getSessionDate(a.consultationDate, a.consultationTime).getTime();
      const bTime = getSessionDate(b.consultationDate, b.consultationTime).getTime();
      return aTime - bTime;
    });
  }, [activeConsultations]);

  const totalPages = Math.ceil(sortedConsultations.length / perPage) || 1;
  const paginated = sortedConsultations.slice((page - 1) * perPage, page * perPage);
  return (
    <div className="space-y-6 md:space-y-8">
      <header>
        <h1 className="font-headline font-bold text-primary text-3xl md:text-4xl tracking-tight">My Consultations</h1>
        <p className="mt-2 text-muted-foreground text-sm md:text-base">View your scheduled sessions and join active ones.</p>
      </header>

      {isLoading && (
        <div className="flex justify-center items-center min-h-[40vh] text-muted-foreground">
          Loading your consultations...
        </div>
      )}

      {!isLoading && sortedConsultations.length === 0 && (
        <Card className="bg-transparent shadow-none py-16 border-dashed text-center">
          <CardContent>
            <p className="font-medium text-muted-foreground text-lg">You have no active consultations.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && sortedConsultations.length > 0 && (
        <>
          <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((c: any) => (
              <ConsultationCard key={c._id} c={c} />
            ))}
          </div>

          {sortedConsultations.length > perPage && (
            <div className="flex justify-between items-center mt-6 pt-6 border-border/40 border-t">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="mr-1 size-4" /> Previous
              </Button>
              <p className="font-medium text-muted-foreground text-sm">Page {page} of {totalPages}</p>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
