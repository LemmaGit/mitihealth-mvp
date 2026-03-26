import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAppApi } from "../../hooks/useAppApi";
import { useAuthStore } from "../../store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Messages = () => {
  const [params] = useSearchParams();
  const receiverId = params.get("practitionerId") || "";
  const { common } = useAppApi();
  const { socket, authUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const { data: currentMessages = [] } = useQuery({
    queryKey: ["messages", receiverId],
    queryFn: () => common.getMessages(receiverId),
    enabled: !!receiverId,
  });
  const sendMutation = useMutation({
    mutationFn: () => common.sendMessage(receiverId, { text: newMessage }),
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", receiverId] });
    },
  });
  useEffect(() => {
    if (!socket) return;
    const onNew = (msg: any) => {
      if (msg.senderId === receiverId || msg.receiverId === receiverId) {
        queryClient.invalidateQueries({ queryKey: ["messages", receiverId] });
      }
    };
    socket.on("newMessage", onNew);
    return () => {
      socket.off("newMessage", onNew);
    };
  }, [socket, receiverId, queryClient]);
  const mapped = useMemo(() => currentMessages as any[], [currentMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-primary">Consultation Chat</h1>
      <div className="rounded-xl bg-card p-4 min-h-[420px]">
        <div className="space-y-3">
          {mapped.map((msg: any) => {
            const mine = msg.senderId === authUser?.id;
            return (
              <div key={msg._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.image && <img src={msg.image} className="mb-2 max-h-40 rounded-md" />}
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-2">
        <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="h-10 flex-1 rounded-lg border px-3" placeholder="Type your message..." />
        <button onClick={handleSend} className="h-10 rounded-lg bg-primary px-4 text-primary-foreground"><Send size={16} /></button>
      </div>
    </div>
  );
};

export default Messages;
