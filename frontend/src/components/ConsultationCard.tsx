import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useAppApi } from "../hooks/useAppApi";
import { cn, getInitials, getSessionDate, getTimeText } from "../lib/utils";
import { differenceInMinutes } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Avatar,AvatarFallback, AvatarImage } from "./ui/avatar";
import { PRACTITIONER_PLACEHOLDER_IMG } from "../lib/practitionerDisplay";
import { CalendarClock, X } from "lucide-react";
import { Button } from "./ui/button";

function ConsultationCard({ c }: { c: any }) {
  const { common, patient } = useAppApi();
  const queryClient = useQueryClient();
  const [isJitsiOpen, setIsJitsiOpen] = useState(false);
  
  const { data: practitioner } = useQuery({
    queryKey: ["patient", "practitioner", c.practitionerId],
    queryFn: () => common.getPractitioner(c.practitionerId),
    enabled: !!c.practitionerId,
  });

  const sessionDate = getSessionDate(c.consultationDate, c.consultationTime);
  const timeText = getTimeText(sessionDate);
  const minsLeft = differenceInMinutes(sessionDate, new Date());
  
  const completeSessionMutation = useMutation({
    mutationFn: () => patient.completeConsultation(c._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", "consultations"] });
      setIsJitsiOpen(false);
    }
  });

  const startSessionMutation = useMutation({
    mutationFn: () => patient.startConsultation(c._id),
    onSuccess: () => {
      if (c.consultationType === "chat") {
        window.location.assign(`/messages?roomId=${c._id}&practitionerId=${c.practitionerId}`);
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

  
console.log(c,"----")
  return (
    <Card className="shadow-sm hover:shadow-botanical border-border/60 hover:border-primary/20 transition-all">
      <CardContent className="flex flex-col space-y-4 p-5 h-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="rounded-xl size-12 shrink-0">
              <AvatarImage src={practitioner?.imageUrl || PRACTITIONER_PLACEHOLDER_IMG} alt="" />
              <AvatarFallback className="bg-primary/10 rounded-xl font-bold text-primary text-sm">
                {getInitials(practitioner?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 truncate">
              {/* <h3 className="font-headline font-semibold text-foreground truncate">{title}</h3> */}
              <p className="flex items-center gap-1 mt-0.5 text-muted-foreground text-xs capitalize">
                {/* <Icon className="size-3" /> */}
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

export default ConsultationCard;
