import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Info,
  Image as ImageIcon,
  ChevronLeft,
  Loader2,
  X,
  Bell,
  Settings,
  MessageSquarePlus,
  Archive,
  Users,
  CheckCheck,
} from "lucide-react";
import { useSearchParams} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppApi } from "../hooks/useAppApi";
import { useAuthStore } from "../store/useAuthStore";
import { Textarea } from "../components/ui/textarea";
import Aside from "../components/message/Message.Aside";
import Placeholder from "../components/message/Message.Placeholder";
import Footer from "../components/message/Message.Footer";
import Main from "../components/message/Message.Main";

type ApiMessage = {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

// type User = {
//   clerkId: string;
//   name: string;
//   role: string;
//   avatar?: string;
//   lastMessage?: string;
//   time?: string;
//   online?: boolean;
//   unreadCount?: number;
// };

function useReceiverId() {
  const [params] = useSearchParams();
  return (
    params.get("practitionerId") ||
    params.get("receiverId") ||
    params.get("userId") ||
    ""
  );
}

function useRoomSession() {
  const [params] = useSearchParams();
  const roomId = params.get("roomId");
  const { patient, practitioner } = useAppApi();
  const { authUser } = useAuthStore();
  
  const { data: sessionInfo, isLoading } = useQuery({
    queryKey: ["consultation", "status", roomId],
    queryFn: () => {
      if (!roomId) return null;
      // Try both APIs since user could be patient or practitioner
      const api = authUser?.unsafeMetadata?.role === "practitioner" ? practitioner : patient;
      return api.getConsultationStatus(roomId);
    },
    enabled: !!roomId,
    refetchInterval: roomId ? 30000 : false, // Poll every 30 seconds for active sessions
  });

  // Get the consultation details to find the other participant
  const { data: consultationDetails } = useQuery({
    queryKey: ["consultation", "details", roomId],
    queryFn: () => {
      if (!roomId) return null;
      const api = authUser?.unsafeMetadata?.role === "practitioner" ? practitioner : patient;
      // We need to get the consultation details to find the other participant
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
    onSuccess: () => {
      // Redirect back to consultations
      window.location.href = `/${authUser?.unsafeMetadata?.role}`;
    }
  });

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    sessionInfo,
    consultationDetails,
    isLoading,
    isRoomSession: !!roomId,
    completeSession: () => completeSessionMutation.mutate(),
    formatTimeRemaining,
    timeRemaining: sessionInfo?.timeRemaining || 0,
    canChat: sessionInfo?.status === "active" && sessionInfo.timeRemaining > 0,
    sessionType: sessionInfo?.consultationType || sessionInfo?.type || "chat",
    duration: sessionInfo?.duration || 30
  };
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatMessageTime(iso?: string) {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  } catch {
    return "";
  }
}

const MessagesPage = () => {
  const receiverId = useReceiverId();
  const { common } = useAppApi();
  const { socket, authUser } = useAuthStore();
  const queryClient = useQueryClient();
  const roomSession = useRoomSession();
  
  // For room sessions, get the correct receiverId from consultation details
  const actualReceiverId = roomSession.isRoomSession && roomSession.consultationDetails
    ? (authUser?.unsafeMetadata?.role === "practitioner" 
        ? roomSession.consultationDetails.patientId 
        : roomSession.consultationDetails.practitionerId)
    : receiverId;

  const [newMessageText, setNewMessageText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"list" | "thread">(
    actualReceiverId ? "thread" : "list",
  );
  const [hiddenChats, setHiddenChats] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("mitihealth_hidden_chats") || "[]");
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobilePanel(actualReceiverId ? "thread" : "list");
  }, [actualReceiverId]);

  // Ensure socket is connected when component mounts
  useEffect(() => {
    if (!socket) {
      console.log("Socket not available, connecting...");
      return;
    }
    
    if (!socket.connected) {
      console.log("Socket not connected, waiting...");
      const checkConnection = setInterval(() => {
        if (socket.connected) {
          console.log("Socket connected successfully!");
          clearInterval(checkConnection);
        }
      }, 1000);
      
      return () => clearInterval(checkConnection);
    } else {
      console.log("Socket already connected");
    }
  }, [socket]);

//TODO: we need to rename the function to getUser
  const { data: userInChatWith, isLoading: userInChatWithLoading } = useQuery({
    queryKey: ["user", actualReceiverId],
    queryFn: () => common.getUser(actualReceiverId),
    enabled: !!actualReceiverId,
  });

  const peerName = useMemo(() => {
    const user = userInChatWith as { name?: string; role?: string; specialization?: string } | undefined;
    return user?.name || "Conversation partner";
  }, [userInChatWith]);

  const peerInitials = useMemo(
    () => initialsFromName(peerName),
    [peerName],
  );

  const { data: currentMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", actualReceiverId],
    queryFn: () => common.getMessages(actualReceiverId) as Promise<ApiMessage[]>,
    enabled: !!actualReceiverId,
  });

  const { data: sidebarUsers = [] } = useQuery({
    queryKey: ["sidebarUsers"],
    queryFn: () => common.getUsersForSidebar() as Promise<any[]>,
  });

  const displayUsers = useMemo(() => {
    const users = (sidebarUsers as any[]).filter(u => !hiddenChats.includes(u.clerkId) || u.role === "admin");
    const admin = users.find(u => u.role === "admin");
    const others = users.filter(u => u.role !== "admin");
    if (admin) return [admin, ...others];
    return others;
  }, [sidebarUsers, hiddenChats]);

  const sortedMessages = useMemo(() => {
    const list = [...(currentMessages as ApiMessage[])];
    list.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return ta - tb;
    });
    return list;
  }, [currentMessages]);

  const sendMutation = useMutation({
    mutationFn: async (payload: { text: string; file?: File | null }) => {
      if (payload.file) {
        const fd = new FormData();
        if (payload.text.trim()) fd.append("text", payload.text.trim());
        fd.append("image", payload.file);
        return common.sendMessage(actualReceiverId, fd);
      }
      return common.sendMessage(actualReceiverId, { text: payload.text.trim() });
    },
    onSuccess: () => {
      setNewMessageText("");
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowAttachMenu(false);
      queryClient.invalidateQueries({ queryKey: ["messages", actualReceiverId] });
      queryClient.invalidateQueries({ queryKey: ["sidebarUsers"] });
      
      // Auto-scroll to bottom after sending
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  useEffect(() => {
    if (!socket) return;
    
    const onNew = (msg: any) => {
      console.log("Received new message:", msg);
      
      // Always invalidate sidebar to show new conversations
      queryClient.invalidateQueries({ queryKey: ["sidebarUsers"] });
      
      // Only update messages if it's for current chat and not from self
      if (actualReceiverId && (msg.senderId === actualReceiverId || msg.receiverId === actualReceiverId) && msg.senderId !== authUser?.id) {
        queryClient.invalidateQueries({ queryKey: ["messages", actualReceiverId] });
        
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };
    
    const onSessionUpdate = (data: any) => {
      console.log("Session update:", data);
      
      // Invalidate consultation status if this is the current room
      const params = new URLSearchParams(window.location.search);
      const roomId = params.get("roomId");
      
      if (roomId && data.consultationId === roomId) {
        queryClient.invalidateQueries({ queryKey: ["consultation", "status", roomId] });
        
        // If session was completed, redirect to consultations
        if (data.status === "completed") {
          setTimeout(() => {
            window.location.href = `/${authUser?.unsafeMetadata?.role}`;
          }, 2000);
        }
      }
    };
    
    socket.on("newMessage", onNew);
    socket.on("consultation:status", onSessionUpdate);
    
    return () => {
      socket.off("newMessage", onNew);
      socket.off("consultation:status", onSessionUpdate);
    };
  }, [socket, actualReceiverId, queryClient, authUser?.id]);

  useEffect(() => {
    // Auto-scroll on message load
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages, sendMutation.isPending]);

  const onTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessageText(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  const handleSend = useCallback(() => {
    const file = pendingFile ?? fileInputRef.current?.files?.[0] ?? null;
    const text = newMessageText.trim();
    if (!actualReceiverId) return;
    if (!text && !file) return;
    sendMutation.mutate({ text: text || "", file });
    setPendingFile(null)
  }, [actualReceiverId, newMessageText, pendingFile, sendMutation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
    setShowAttachMenu(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPendingFile(file);
    }
    setShowAttachMenu(false);
  }, []);

  const removePendingFile = useCallback(() => {
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const canSend = !!actualReceiverId && (newMessageText.trim().length > 0 || !!pendingFile) && 
  (!roomSession.isRoomSession || roomSession.canChat);


  return (
      <div className="flex flex-col shadow-sm rounded-lg h-full overflow-hidden">

        <div className="flex flex-1 bg-white overflow-hidden">
          <Aside displayUsers={displayUsers} receiverId={actualReceiverId} mobilePanel={mobilePanel} setPanel={()=>setMobilePanel("thread")}/>

          <main className={`${!actualReceiverId ? "hidden sm:flex sm:flex-1": "flex flex-1"} flex-col overflow-hidden`}>
            {!actualReceiverId ? (
              <Placeholder />
            ) : (
              <>
              {roomSession.isRoomSession && (
                <div className="flex justify-between items-center bg-primary/10 px-4 py-3 border-primary/20 border-b">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary capitalize">
                      {roomSession.sessionType} Session
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {roomSession.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {roomSession.sessionInfo?.status === "active" && (
                      <span className="font-mono font-medium text-primary text-sm">
                        {roomSession.formatTimeRemaining(roomSession.timeRemaining)}
                      </span>
                    )}
                    <button
                      onClick={roomSession.completeSession}
                      className="bg-destructive/10 hover:bg-destructive/20 px-3 py-1 rounded-lg text-destructive text-sm transition-colors"
                    >
                      End Session
                    </button>
                  </div>
                </div>
              )}
              <Main
               authUser={authUser} 
               receiverImage={userInChatWith.imageUrl}
               formatMessageTime={formatMessageTime} 
               isPending={sendMutation.isPending} 
               messagesEndRef={messagesEndRef} 
               messagesLoading={messagesLoading} 
               sortedMessages={sortedMessages} 
               peerInitials={peerInitials}
               />

                <Footer pendingFile={pendingFile} removePendingFile={removePendingFile}>
                  <div className="flex items-center gap-3 bg-muted/50 shadow-inner mx-auto p-2 border border-border/15 rounded-2xl max-w-4xl">
                    <div className="flex gap-1 mb-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <button
                        onClick={triggerFileInput}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ImageIcon size={20} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <Textarea
                        value={newMessageText}
                        onChange={onTextAreaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        rows={1}
                        disabled={sendMutation.isPending}
                        className="bg-transparent px-1 py-2 border-none focus:outline-none focus:ring-0 w-full text-foreground placeholder:text-muted-foreground text-sm resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <button
                        onClick={handleSend}
                        disabled={!canSend || sendMutation.isPending}
                        className="flex justify-center items-center disabled:opacity-50 shadow-lg hover:brightness-110 rounded-xl w-10 h-10 text-primary-foreground active:scale-95 transition-all shrink-0 botanical-gradient"
                      >
                        {sendMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </Footer>
              </>
            )}
          </main>

        </div>
      </div>
  );
};

export default MessagesPage;


