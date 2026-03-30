import { useState, useRef } from "react";
import { Bell, Settings, Send, Smile, ImagePlus, Paperclip, Video, Info, MessageSquarePlus, Archive, Users, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Leaf, Droplets } from "lucide-react";

import drSelamawit from "../../assets/dr-selamawit.jpg";
import drHelina from "../../assets/dr-helina.jpg";
import koseretHerb from "../../assets/koseret-herb.jpg";
import patientAvatar from "../../assets/patient-avatar.jpg";

interface Message {
  id: number;
  from: "patient" | "doctor";
  text?: string;
  image?: string;
  attachment?: { name: string; image: string };
  time: string;
  read?: boolean;
}

const conversations = [
  {
    id: 1,
    name: "Dr. Selamawit",
    avatar: drSelamawit,
    lastMessage: "The Koseret tea should help...",
    time: "10:42 AM",
    online: true,
    active: true,
  },
  {
    id: 2,
    name: "Dr. Helina",
    avatar: drHelina,
    lastMessage: "Checking in on your progress wit...",
    time: "Yesterday",
    online: false,
    active: false,
  },
  {
    id: 3,
    name: "Herbalists Collective",
    avatar: null,
    lastMessage: "Amanuel: We found fresh Damak...",
    time: "Wed",
    online: false,
    active: false,
    isGroup: true,
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    from: "doctor",
    text: "Good morning! Based on your last consultation, how are you feeling after starting the daily infusion of Moringa and Ethiopian Highland Honey?",
    time: "09:15 AM",
  },
  {
    id: 2,
    from: "patient",
    text: "Good morning Dr. Selamawit! I've noticed a significant improvement in my energy levels during the afternoon. The digestive discomfort has also subsided.",
    time: "09:42 AM",
    read: true,
  },
  {
    id: 3,
    from: "doctor",
    text: "That's excellent news. I'd like to adjust your evening routine slightly. Let's add Koseret (Lippia abyssinica) to your routine before bed to support deeper sleep.",
    time: "10:42 AM",
  },
  {
    id: 4,
    from: "doctor",
    attachment: { name: "Koseret Preparation Guide.pdf", image: koseretHerb },
    time: "10:42 AM",
  },
  {
    id: 5,
    from: "patient",
    text: "I will pick some up from the botanical market today. Thank you!",
    time: "10:45 AM",
    read: true,
  },
];

export default function PatientChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [selectedConvo, setSelectedConvo] = useState(1);
  const [isTyping, setIsTyping] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      from: "patient",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newMsg: Message = {
        id: Date.now(),
        from: "patient",
        image: reader.result as string,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      setMessages((prev) => [...prev, newMsg]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col bg-background h-screen">
      {/* Top Nav */}
      <nav className="top-0 z-50 fixed flex justify-between items-center bg-background/80 backdrop-blur-md px-6 py-3 w-full">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display font-bold text-primary text-xl">Botanica Chat</Link>
          <div className="hidden md:flex gap-6">
            {["Garden", "Library", "Consultations"].map((l) => (
              <a key={l} className="font-display font-semibold text-muted-foreground hover:text-primary text-sm transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:bg-muted p-2 rounded-full text-muted-foreground transition-colors"><Bell size={20} /></button>
          <button className="hover:bg-muted p-2 rounded-full text-muted-foreground transition-colors"><Settings size={20} /></button>
          <img alt="User" src={patientAvatar} className="rounded-full w-8 h-8 object-cover" />
        </div>
      </nav>

      <div className="flex flex-1 pt-[60px]">
        {/* Sidebar - Conversations */}
        <aside className="hidden md:flex flex-col bg-muted/30 border-border/15 border-r w-80 h-full">
          <div className="px-4 py-6">
            <h1 className="font-display font-bold text-foreground text-lg">Conversations</h1>
            <p className="text-muted-foreground text-xs">Ancient Wisdom, Modern Chat</p>
          </div>
          <nav className="flex flex-col flex-1 gap-1 px-3 overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConvo(c.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:translate-x-0.5",
                  selectedConvo === c.id
                    ? "bg-accent/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <div className="relative flex-shrink-0">
                  {c.avatar ? (
                    <img src={c.avatar} alt={c.name} className="rounded-full w-12 h-12 object-cover" loading="lazy" />
                  ) : (
                    <div className="flex justify-center items-center bg-muted rounded-full w-12 h-12">
                      <Users size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  {c.online && (
                    <span className="right-0 bottom-0 absolute bg-primary border-2 border-background rounded-full w-3 h-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate">{c.name}</span>
                    <span className="opacity-60 text-[10px]">{c.time}</span>
                  </div>
                  <p className="opacity-70 text-xs truncate">{c.lastMessage}</p>
                </div>
              </button>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-auto p-4">
            <Button className="gap-2 w-full text-primary-foreground botanical-gradient">
              <MessageSquarePlus size={16} /> Start New Thread
            </Button>
            <button className="flex items-center gap-3 hover:bg-muted p-2 rounded-xl text-muted-foreground text-xs transition-colors">
              <Archive size={16} /> Archive
            </button>
            <button className="flex items-center gap-3 hover:bg-muted p-2 rounded-xl text-muted-foreground text-xs transition-colors">
              <Settings size={16} /> Settings
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-col flex-1">
          {/* Chat Header */}
          <header className="flex justify-between items-center bg-muted/50 shadow-sm px-6 h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={drSelamawit} alt="Dr. Selamawit" className="rounded-full w-10 h-10 object-cover" />
                <span className="right-0 bottom-0 absolute bg-primary border-2 border-background rounded-full w-2.5 h-2.5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-foreground text-sm">Dr. Selamawit</h2>
                <span className="font-medium text-[11px] text-primary uppercase tracking-wider">Online • Clinical Herbalist</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hover:bg-muted p-2 rounded-lg text-muted-foreground transition-colors"><Video size={20} /></button>
              <button className="hover:bg-muted p-2 rounded-lg text-muted-foreground transition-colors"><Info size={20} /></button>
            </div>
          </header>

          {/* Messages */}
          <ScrollArea className="flex-1 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px]">
            <div className="space-y-6 p-6">
              {/* Date separator */}
              <div className="flex justify-center">
                <span className="bg-muted px-3 py-1 rounded-full font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Today</span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3",
                    msg.from === "patient" ? "ml-auto max-w-[80%] flex-row-reverse" : "max-w-[80%]"
                  )}
                >
                  {msg.from === "doctor" && (
                    <img src={drSelamawit} alt="Dr. Selamawit" className="flex-shrink-0 mt-1 rounded-full w-8 h-8 object-cover" loading="lazy" />
                  )}
                  <div className={cn("space-y-1", msg.from === "patient" ? "text-right" : "")}>
                    {msg.text && (
                      <div
                        className={cn(
                          "shadow-sm px-4 py-3 rounded-2xl text-sm leading-relaxed",
                          msg.from === "patient"
                            ? "rounded-tr-none botanical-gradient text-primary-foreground shadow-md"
                            : "rounded-tl-none bg-card text-foreground"
                        )}
                      >
                        {msg.text}
                      </div>
                    )}
                    {msg.image && (
                      <div className={cn(
                        "shadow-sm rounded-2xl overflow-hidden",
                        msg.from === "patient" ? "rounded-tr-none" : "rounded-tl-none"
                      )}>
                        <img src={msg.image} alt="Shared image" className="w-full max-w-sm max-h-64 object-cover" />
                      </div>
                    )}
                    {msg.attachment && (
                      <div className="shadow-sm border-4 border-card rounded-xl max-w-sm overflow-hidden">
                        <img src={msg.attachment.image} alt={msg.attachment.name} className="w-full h-40 object-cover" loading="lazy" />
                        <div className="flex justify-between items-center bg-card p-3">
                          <span className="font-semibold text-primary text-xs">{msg.attachment.name}</span>
                          <Paperclip size={16} className="text-primary" />
                        </div>
                      </div>
                    )}
                    <div className={cn("flex items-center gap-1 text-[10px] text-muted-foreground", msg.from === "patient" ? "justify-end" : "")}>
                      <span>{msg.time}</span>
                      {msg.read && <CheckCheck size={12} className="text-primary" />}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <img src={drSelamawit} alt="Dr. Selamawit" className="rounded-full w-8 h-8 object-cover" loading="lazy" />
                  <div className="flex gap-1 bg-card px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-pulse" />
                    <div className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-pulse [animation-delay:0.2s]" />
                    <div className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <footer className="bg-background p-4 lg:p-6">
            <div className="flex items-end gap-3 bg-muted/50 shadow-inner mx-auto p-2 border border-border/15 rounded-2xl max-w-4xl">
              <div className="flex gap-1 mb-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                >
                  <ImagePlus size={20} />
                </button>
              </div>
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message to Dr. Selamawit..."
                  rows={1}
                  className="bg-transparent px-1 py-2 border-none focus:outline-none focus:ring-0 w-full text-foreground placeholder:text-muted-foreground text-sm resize-none"
                />
              </div>
              <div className="flex items-center gap-1 mb-1">
                <button className="p-2 rounded-lg text-muted-foreground hover:text-secondary transition-colors">
                  <Smile size={18} />
                </button>
                <button
                  onClick={sendMessage}
                  className="flex justify-center items-center shadow-lg hover:brightness-110 rounded-xl w-10 h-10 text-primary-foreground active:scale-95 transition-all botanical-gradient"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </footer>
        </main>

        {/* Right Detail Panel */}
        <aside className="hidden lg:flex flex-col bg-muted/30 p-6 border-border/15 border-l w-72 overflow-y-auto">
          <div className="mb-6 text-center">
            <img src={drSelamawit} alt="Dr. Selamawit" className="shadow-md mx-auto mb-4 border-4 border-card rounded-full w-24 h-24 object-cover" />
            <h3 className="font-display font-bold text-foreground">Dr. Selamawit K.</h3>
            <p className="font-medium text-muted-foreground text-xs">Addis Ababa, Ethiopia</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Specialization</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-accent px-3 py-1 rounded-full font-semibold text-[11px] text-accent-foreground">Phytotherapy</span>
                <span className="bg-accent px-3 py-1 rounded-full font-semibold text-[11px] text-accent-foreground">Traditional Wisdom</span>
              </div>
            </div>

            <div className="bg-card shadow-botanical p-4 rounded-xl">
              <h4 className="mb-2 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Current Regimen</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-accent/15 rounded-lg w-8 h-8">
                    <Leaf size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-[11px] text-foreground">Moringa Oleifera</p>
                    <p className="text-[10px] text-muted-foreground">2x Daily Infusion</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-accent/15 rounded-lg w-8 h-8">
                    <Droplets size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-[11px] text-foreground">Highland Honey</p>
                    <p className="text-[10px] text-muted-foreground">With morning tea</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="hover:bg-muted py-2 border border-border/30 rounded-lg w-full font-semibold text-muted-foreground text-xs transition-colors">
              View Full Medical Profile
            </button>
          </div>

          <div className="mt-auto pt-8">
            <div className="bg-secondary/5 p-4 border border-secondary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <h4 className="font-bold text-[11px] text-secondary">Botanical Tip</h4>
              </div>
              <p className="text-[11px] text-secondary/80 italic leading-relaxed">
                "Damakesse is known to clear respiratory pathways. Gently crush fresh leaves to release the essential oils."
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
