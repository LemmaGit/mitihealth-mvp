import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppApi } from "./useAppApi";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAfter, parseISO } from "date-fns";

function useRoomSession() {
  const navigate = useNavigate()
  const [params] = useSearchParams();
  const roomId = params.get("roomId");
  const { patient, practitioner, common } = useAppApi();
  const { authUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data: sessionInfo, isLoading } = useQuery({
    queryKey: ["consultation", "status", roomId],
    queryFn: () => {
      if (!roomId) return null;
      const api = authUser?.unsafeMetadata?.role === "practitioner" ? practitioner : patient;
      return api.getConsultationStatus(roomId);
    },
    enabled: !!roomId,
    refetchInterval: roomId ? 30000 : false, 
  });

  const { data: consultationDetails } = useQuery({
    queryKey: ["consultation", "details", roomId],
    queryFn: () => {
      if (!roomId) return null;
      const api = authUser?.unsafeMetadata?.role === "practitioner" ? practitioner : patient;
      return api.getMyConsultations().then((consultations: any[]) => 
        consultations.find(c => c._id === roomId)
      );
    },
    enabled: !!roomId,
  });

  const completeSessionMutation = useMutation({
    mutationFn: () => {
      if (!roomId) return Promise.resolve();
      const api = authUser?.unsafeMetadata?.role === "practitioner" ? practitioner : patient;
      return api.completeConsultation(roomId);
    },
    onSuccess: async () => {
      // Hide the conversation (cleanup thread)
      const params = new URLSearchParams(window.location.search);
      const receiverId = params.get("practitionerId") || params.get("receiverId") || params.get("userId");
      
      if (receiverId) {
        try {
          await common.hideConversation(receiverId);
        } catch (error) {
          console.error("Error hiding conversation:", error);
        }
      }

      // Finalize the sidebar UI
      queryClient.invalidateQueries({ queryKey: ["sidebarUsers"] });

      return navigate(`/${authUser?.unsafeMetadata?.role}`, {
        replace: true
      });
    }
  });

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
let end,isOver;
if(sessionInfo) {
    end = parseISO(sessionInfo.status.sessionEndTime
);
   isOver = isAfter(new Date(), end);
}


  return {
    sessionInfo,
    consultationDetails,
    isLoading,
    isRoomSession: !!roomId,
    completeSession: () => completeSessionMutation.mutate(),
    formatTimeRemaining,
    timeRemaining: sessionInfo?.timeRemaining || 0,
    canChat: sessionInfo&&sessionInfo.status?.status === "active" && !isOver,
    // canChat: sessionInfo?.status === "active" && sessionInfo.timeRemaining > 0,
    sessionType: sessionInfo?.consultationType || sessionInfo?.type || "chat",
    duration: sessionInfo?.duration || 30
  };
}

export default useRoomSession;
