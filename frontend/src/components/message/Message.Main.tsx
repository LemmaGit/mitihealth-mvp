import { ArrowLeftIcon,Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn, getInitials } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Main = ({
    isPending,
    messagesLoading,
    sortedMessages,
    authUser,
    receiverImage,
    peerInitials,
    formatMessageTime,
    messagesEndRef
    })=>{
    const navigate = useNavigate()
    return (
        <ScrollArea className="relative flex-1 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] background-size-[24px_24px] overflow-y-auto">
            <Button className="top-2 left-2 z-50 absolute flex justify-center items-center --bg-gray-400 backdrop-blur-2xl rounded-full w-8 h-8" onClick={()=>{navigate("/messages")}}>
                <ArrowLeftIcon color="#fff"/>
            </Button>
                  <div className="space-y-6 p-6">
                    {/* Date separator */}
                    <div className="flex justify-center">
                      <span className="bg-muted px-3 py-1 rounded-full font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Today</span>
                    </div>

                    {messagesLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="size-8 text-primary animate-spin" />
                      </div>
                    ) : (
                      <>
                        {sortedMessages.map((msg) => {
                          const mine = msg.senderId === authUser?.id;
                          return (
                            <div
                              key={msg._id}
                              className={cn(
                                "flex items-start gap-3",
                                mine ? "ml-auto max-w-[80%] flex-row-reverse" : "max-w-[80%]"
                              )}
                            >
                              {!mine && (
                                <Avatar  className="mt-1 w-8 h-8 shrink-0">
                                    <AvatarImage src={receiverImage}/>
                                  <AvatarFallback className="bg-muted/20 text-xs">
                                    {peerInitials}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className={cn("space-y-1", mine ? "text-right" : "")}>
                                {msg.text && (
                                  <div
                                    className={cn(
                                      "shadow-sm px-4 py-3 rounded-2xl w-fit text-sm leading-relaxed",
                                      mine
                                        ? "rounded-tr-none botanical-gradient text-primary-foreground shadow-md ml-auto"
                                        : "rounded-tl-none bg-card text-foreground mr-auto"
                                    )}
                                  >
                                    {msg.text}
                                  </div>
                                )}
                                {msg.image && (
                                  <div className={cn(
                                    "shadow-sm rounded-2xl max-w-sm overflow-hidden",
                                    mine ? "rounded-tr-none" : "rounded-tl-none"
                                  )}>
                                    <img src={msg.image} alt="Shared image" className="w-full max-h-64 object-cover" />
                                  </div>
                                )}
                                <div className={cn("flex items-center gap-1 text-[10px] text-muted-foreground", mine ? "justify-end" : "")}>
                                  <span>{formatMessageTime(msg.createdAt)}</span>
                                  {/* {mine && <CheckCheck size={12} className="text-primary" />} */}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {isPending && (
                          <div className="flex justify-end gap-3">
                            <Avatar className="mt-1 w-8 h-8">
                                <AvatarImage src={authUser.imageUrl} />
                              <AvatarFallback className="bg-muted/20 text-xs">
                                {getInitials(authUser?.firstName + " " + authUser?.lastName || "You")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex gap-1 bg-card --ml-auto px-4 py-3 rounded-2xl rounded-tl-none">
                              <div className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-pulse" />
                              <div className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-pulse [animation-delay:0.2s]" />
                              <div className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-pulse [animation-delay:0.4s]" />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
    )
}

export default Main;