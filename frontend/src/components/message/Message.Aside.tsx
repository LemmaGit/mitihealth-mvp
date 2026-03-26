import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { cn, getInitials } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import { toast } from "sonner";

const Aside = ({
    mobilePanel,
    receiverId,
    setPanel,
    displayUsers
    })=>{
    const { common } = useAppApi();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const hideChatMutation = useMutation({
      mutationFn: (userId: string) => common.hideConversation(userId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sidebarUsers"] });
        toast.success("Conversation Hidden", {
          description: "The conversation has been hidden from your list.",
        });
        navigate("/messages")
      },
      onError: () => {
        toast.error("Error", {
          description: "Failed to hide conversation. Please try again.",
        });
      }
    });

    const hideChat = (userId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        hideChatMutation.mutate(userId);
    };

return (
    <aside
            className={cn(
              "hidden md:flex flex-col bg-muted/30 border-border/15 border-r w-80 h-full",
              mobilePanel === "thread" && receiverId ? "hidden md:flex" : "flex",!receiverId && "flex-1 sm:flex-initial"
            )}
          >
            <div className="px-4 py-6">
              <h1 className="font-display font-bold text-foreground text-lg">Conversations</h1>
              <p className="text-muted-foreground text-xs">Connect with your care team</p>
            </div>
            
            <ScrollArea className="flex-1 px-3 overflow-y-auto">
              {displayUsers.length === 0 ? (
                <div className="flex flex-col gap-3 p-6 text-muted-foreground text-sm text-center">
                  <p>No conversations available.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {displayUsers.map((user) => {
                    const isSelected = user.clerkId === receiverId;
                    const isActiveThread = isSelected && mobilePanel === "thread";
                    return (
                      <Link
                        key={user.clerkId}
                        to={`/messages?receiverId=${user.clerkId}`}
                        onClick={()=>setPanel()}
                        className={cn(
                          "group relative flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:translate-x-0.5",
                          isActiveThread || isSelected
                            ? "bg-accent/10 font-semibold text-primary"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <div className="relative shrink-0">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.imageUrl ||user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          {user.online && (
                            <span className="right-0 bottom-0 absolute bg-primary border-2 border-background rounded-full w-3 h-3" />
                          )}
                          {user.hasNewMessage && (
                            <span className="top-0 right-0 absolute bg-destructive border-2 border-background rounded-full w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm truncate">{user.name}</span>
                            <div className="flex items-center gap-1">
                              {user.unreadCount && user.unreadCount > 0 && (
                                <Badge variant="destructive" className="p-0 rounded-full w-5 h-5 text-xs">
                                  {user.unreadCount}
                                </Badge>
                              )}
                              <span className="opacity-60 text-[10px]">{user.time}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="opacity-70 text-xs truncate">{user.lastMessage}</p>
                            {user.role !== "admin" && (
                              <button
                                onClick={(e) => hideChat(user.clerkId, e)}
                                title="Hide conversation"
                                className="hover:bg-surface-container opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive transition-all"
                              >
                                <X className="size-3" />
                              </button>
                            )}
                          </div>
                          {user.role === "admin" && (
                            <Badge variant="secondary" className="bg-primary/20 shadow-none mt-1 px-1 py-0 text-[9px] text-primary">Admin</Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

           
          </aside>
)
}

export default Aside;