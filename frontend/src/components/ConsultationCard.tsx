import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppApi } from "../hooks/useAppApi";
import { cn, getInitials, getSessionDate, getTimeText } from "../lib/utils";
import { differenceInMinutes } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Avatar,AvatarFallback, AvatarImage } from "./ui/avatar";
import { PRACTITIONER_PLACEHOLDER_IMG } from "../lib/practitionerDisplay";
import { CalendarClock } from "lucide-react";
import { Button } from "./ui/button";

function ConsultationCard({ c }: { c: any }) {
  const { common, patient } = useAppApi();
  const { data: practitioner } = useQuery({
    queryKey: ["patient", "practitioner", c.practitionerId],
    queryFn: () => common.getPractitioner(c.practitionerId),
    enabled: !!c.practitionerId,
  });

  const sessionDate = getSessionDate(c.consultationDate, c.consultationTime);
  const timeText = getTimeText(sessionDate);
  const minsLeft = differenceInMinutes(sessionDate, new Date());
  
  const startSessionMutation = useMutation({
    mutationFn: () => patient.startConsultation(c._id),
    onSuccess: () => {
      if (c.consultationType === "chat") {
        window.location.assign(`/messages?roomId=${c._id}&practitionerId=${c.practitionerId}`);
      } else if (c.jitsiRoom) {
        window.open(`https://meet.jit.si/${c.jitsiRoom}`, "_blank");
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
    if (c.status === "active") {
        //TODO: here instead of checking the status check the time left in the session and have a mutator here to change the status of the consultation if it says active
      return { text: "Join Session", disabled: false };
    }
    // For booked sessions
    if (minsLeft > 0) {
      return { text: "Not Yet", disabled: true };
    }
    return { text: "Begin Now", disabled: false };
  };
  
  const buttonState = getButtonState();

  

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
    </Card>
  );
}

export default ConsultationCard;