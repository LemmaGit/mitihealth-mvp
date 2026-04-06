import { useMemo, useState, useEffect } from "react";
import { useAppApi } from "../../hooks/useAppApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { differenceInMinutes } from "date-fns";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { MessageCircle, Phone, Video, CalendarClock, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { cn, getInitials, getSessionDate, getTimeText } from "../../lib/utils";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";

const TYPE_ICONS: Record<string, any> = {
  chat: MessageCircle,
  audio: Phone,
  video: Video,
};

function PractitionerConsultationCard({ c }: { c: any }) {
  const { practitioner } = useAppApi();
  const queryClient = useQueryClient();
  const [isJitsiOpen, setIsJitsiOpen] = useState(false);
  const sessionDate = getSessionDate(c.consultationDate, c.consultationTime);
  const minsLeft = differenceInMinutes(sessionDate, new Date());
  
  const completeSessionMutation = useMutation({
    mutationFn: () => practitioner.completeConsultation(c._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practitioner", "consultations"] });
      setIsJitsiOpen(false);
    }
  });

  const startSessionMutation = useMutation({
    mutationFn: () => practitioner.startConsultation(c._id),
    onSuccess: () => {
      if (c.consultationType === "chat") {
        //TODO use navigate
        window.location.assign(`/messages?roomId=${c._id}&receiverId=${c.patientId}`);
      } else if (c.jitsiRoom) {
        setIsJitsiOpen(true);
      }
    }
  });
  
  const joinConsultation = () => {
    startSessionMutation.mutate();
  };
  
  // Determine button state
  const getButtonState = () => {
    if (c.status === "completed") {
      return { text: "Session Completed", disabled: true };
    }
    
    // Auto-transition UI if active but time has run out
    if (c.status === "active" && c.sessionEndTime) {
       const endTimePassed = new Date() >= new Date(c.sessionEndTime);
       if(endTimePassed) {
         return { text: "Session Completed", disabled: true };
       }
    }
    
    if (c.status === "active") {
      // If session hasn't started yet (no sessionEndTime), check if it's too early
      if (!c.sessionEndTime && minsLeft > 0) {
        return { text: "Not Yet", disabled: true };
      }
      return { text: "Join Session", disabled: false };
    }
    
    return { text: "Begin Now", disabled: false };
  };
  
  const buttonState = getButtonState();
  const timeText = getTimeText(sessionDate);
  
  const Icon = TYPE_ICONS[c.consultationType] || MessageCircle;
  console.log(c)
  return (
    <Card className="shadow-sm hover:shadow-botanical border-border/60 hover:border-primary/20 transition-all">
      <CardContent className="flex flex-col space-y-4 p-5 h-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="rounded-xl size-12 shrink-0">
              <AvatarImage
                        src={c.patientProfile.imageUrl}
                        alt={c.patientProfile.fullName}
                        />
              <AvatarFallback className="bg-primary/10 rounded-xl font-bold text-primary text-sm">
                {getInitials(c.patientProfile.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 truncate">
              <h3 className="font-headline font-semibold text-foreground truncate">{c.patientProfile.fullName}</h3>
              <p className="flex items-center gap-1 mt-0.5 text-muted-foreground text-xs capitalize">
                <Icon className="size-3" />
                {c.consultationType} session
              </p>
            </div>
          </div>
          <div className={cn("flex items-center gap-0.5 px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider shrink-0", 
            c.status === "active" ? "bg-emerald-100 text-emerald-800" : c.status === "completed" ? "bg-stone-100 text-stone-600" : "bg-primary/10 text-primary"
          )}>
            <CalendarClock className="size-3" />
            {timeText}
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded-lg text-sm">
          <span className="font-medium text-muted-foreground">
             {sessionDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span className="font-semibold text-foreground">{c.consultationTime}</span>
        </div>

        <div className="mt-auto pt-2">
          <Button 
            className="w-full font-semibold"
            disabled={buttonState.disabled || startSessionMutation.isPending}
            variant={buttonState.disabled ? "secondary" : "default"}
            onClick={joinConsultation}
          >
            {startSessionMutation.isPending ? "Starting..." : buttonState.text}
          </Button>
        </div>
      </CardContent>

      {isJitsiOpen && (
        <div className="fixed inset-0 z-9999 bg-background flex flex-col">
          <div className="bg-primary/5 border-b flex items-center justify-between px-4 py-2">
            <div className="font-semibold text-primary">MitiHealth Consultation</div>
            <Button variant="ghost" size="sm" onClick={() => completeSessionMutation.mutate()}>
              <X className="mr-2 size-4" /> Close Session
            </Button>
          </div>
          <div className="flex-1 w-full relative">
            <JitsiMeeting
              domain="meet.jit.si"
              roomName={c.jitsiRoom}
              configOverwrite={{
                startAudioOnly: c.consultationType === "audio",
                startWithAudioMuted: false,
                disableModeratorIndicator: true,
                startScreenSharing: false,
                enableEmailInStats: false
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
              }}
              onApiReady={(externalApi) => {
                externalApi.addListener('videoConferenceLeft', () => {
                  completeSessionMutation.mutate();
                });
                externalApi.addListener('readyToClose', () => {
                  completeSessionMutation.mutate();
                });
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.height = '100%';
                iframeRef.style.width = '100%';
                iframeRef.style.border = 'none';
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Consultations() {
  const { practitioner } = useAppApi();
  const { socket, authUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const perPage = 9;
  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ["practitioner", "consultations"],
    queryFn: () => practitioner.getMyConsultations(),
  });
  // Listen for new consultation bookings
  useEffect(() => {
    if (!socket) return;

    const onNewConsultation = (data: any) => {
      console.log("New consultation booked:", data);
      
      // Only update if this consultation is for current practitioner
      if (data.practitionerId === authUser?.id) {
        // Invalidate consultations query to show new booking
        queryClient.invalidateQueries({ queryKey: ["practitioner", "consultations"] });
        
        // Show toast notification
        if (data.patientName && data.consultationType) {
          toast.success(`New ${data.consultationType} consultation booked by ${data.patientName}`, {
            description: `Scheduled for ${new Date(data.consultationDate).toLocaleDateString()} at ${data.consultationTime}`,
            duration: 5000,
          });
        }
      }
    };

    socket.on("consultation:new", onNewConsultation);

    return () => {
      socket.off("consultation:new", onNewConsultation);
    };
  }, [socket, authUser?.id, queryClient]);

  const activeConsultations = useMemo(() => {
    return (consultations as any[]).filter(c => c.status === "active");
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
        <p className="mt-2 text-muted-foreground text-sm md:text-base">View your scheduled sessions with patients.</p>
      </header>

      {isLoading && (
        <div className="flex justify-center items-center min-h-[40vh] text-muted-foreground">
          Loading your consultations...
        </div>
      )}

      {!isLoading && sortedConsultations.length === 0 && (
        <Card className="bg-transparent shadow-none py-16 border-dashed text-center">
          <CardContent>
            <p className="font-medium text-muted-foreground text-lg">You have no active patient consultations.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && sortedConsultations.length > 0 && (
        <>
          <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((c: any) => (
              <PractitionerConsultationCard key={c._id} c={c} />
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
