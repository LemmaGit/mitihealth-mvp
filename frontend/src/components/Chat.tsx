import { useState, useRef } from "react";
import { Bell, Settings, Send, Smile, ImagePlus, Paperclip, Video, Info, MessageSquarePlus, Archive, Users, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
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
    <div className="flex h-screen flex-col bg-background">
      {/* Top Nav */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-background/80 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-xl font-bold text-primary">Botanica Chat</Link>
          <div className="hidden gap-6 md:flex">
            {["Garden", "Library", "Consultations"].map((l) => (
              <a key={l} className="font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">{l}</a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"><Bell size={20} /></button>
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"><Settings size={20} /></button>
          <img alt="User" src={patientAvatar} className="h-8 w-8 rounded-full object-cover" />
        </div>
      </nav>

      <div className="flex flex-1 pt-[60px]">
        {/* Sidebar - Conversations */}
        <aside className="hidden h-full w-80 flex-col border-r border-border/15 bg-muted/30 md:flex">
          <div className="px-4 py-6">
            <h1 className="font-display text-lg font-bold text-foreground">Conversations</h1>
            <p className="text-xs text-muted-foreground">Ancient Wisdom, Modern Chat</p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConvo(c.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:translate-x-0.5",
                  selectedConvo === c.id
                    ? "bg-accent/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <div className="relative flex-shrink-0">
                  {c.avatar ? (
                    <img src={c.avatar} alt={c.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Users size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  {c.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm">{c.name}</span>
                    <span className="text-[10px] opacity-60">{c.time}</span>
                  </div>
                  <p className="truncate text-xs opacity-70">{c.lastMessage}</p>
                </div>
              </button>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 p-4">
            <Button className="w-full gap-2 botanical-gradient text-primary-foreground">
              <MessageSquarePlus size={16} /> Start New Thread
            </Button>
            <button className="flex items-center gap-3 rounded-xl p-2 text-xs text-muted-foreground transition-colors hover:bg-muted">
              <Archive size={16} /> Archive
            </button>
            <button className="flex items-center gap-3 rounded-xl p-2 text-xs text-muted-foreground transition-colors hover:bg-muted">
              <Settings size={16} /> Settings
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-1 flex-col">
          {/* Chat Header */}
          <header className="flex h-16 items-center justify-between bg-muted/50 px-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={drSelamawit} alt="Dr. Selamawit" className="h-10 w-10 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold text-foreground">Dr. Selamawit</h2>
                <span className="text-[11px] font-medium uppercase tracking-wider text-primary">Online • Clinical Herbalist</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"><Video size={20} /></button>
              <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"><Info size={20} /></button>
            </div>
          </header>

          {/* Messages */}
          <ScrollArea className="flex-1 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px]">
            <div className="space-y-6 p-6">
              {/* Date separator */}
              <div className="flex justify-center">
                <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today</span>
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
                    <img src={drSelamawit} alt="Dr. Selamawit" className="mt-1 h-8 w-8 flex-shrink-0 rounded-full object-cover" loading="lazy" />
                  )}
                  <div className={cn("space-y-1", msg.from === "patient" ? "text-right" : "")}>
                    {msg.text && (
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
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
                        "overflow-hidden rounded-2xl shadow-sm",
                        msg.from === "patient" ? "rounded-tr-none" : "rounded-tl-none"
                      )}>
                        <img src={msg.image} alt="Shared image" className="max-h-64 w-full max-w-sm object-cover" />
                      </div>
                    )}
                    {msg.attachment && (
                      <div className="max-w-sm overflow-hidden rounded-xl border-4 border-card shadow-sm">
                        <img src={msg.attachment.image} alt={msg.attachment.name} className="h-40 w-full object-cover" loading="lazy" />
                        <div className="flex items-center justify-between bg-card p-3">
                          <span className="text-xs font-semibold text-primary">{msg.attachment.name}</span>
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
                  <img src={drSelamawit} alt="Dr. Selamawit" className="h-8 w-8 rounded-full object-cover" loading="lazy" />
                  <div className="flex gap-1 rounded-2xl rounded-tl-none bg-card px-4 py-3">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <footer className="bg-background p-4 lg:p-6">
            <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-border/15 bg-muted/50 p-2 shadow-inner">
              <div className="mb-1 flex gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary"
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
                  className="w-full resize-none border-none bg-transparent px-1 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                />
              </div>
              <div className="mb-1 flex items-center gap-1">
                <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-secondary">
                  <Smile size={18} />
                </button>
                <button
                  onClick={sendMessage}
                  className="flex h-10 w-10 items-center justify-center rounded-xl botanical-gradient text-primary-foreground shadow-lg transition-all hover:brightness-110 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </footer>
        </main>

        {/* Right Detail Panel */}
        <aside className="hidden w-72 flex-col overflow-y-auto border-l border-border/15 bg-muted/30 p-6 lg:flex">
          <div className="mb-6 text-center">
            <img src={drSelamawit} alt="Dr. Selamawit" className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-card object-cover shadow-md" />
            <h3 className="font-display font-bold text-foreground">Dr. Selamawit K.</h3>
            <p className="text-xs font-medium text-muted-foreground">Addis Ababa, Ethiopia</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Specialization</h4>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">Phytotherapy</span>
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">Traditional Wisdom</span>
              </div>
            </div>

            <div className="rounded-xl bg-card p-4 shadow-botanical">
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Regimen</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
                    <Leaf size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-foreground">Moringa Oleifera</p>
                    <p className="text-[10px] text-muted-foreground">2x Daily Infusion</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
                    <Droplets size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-foreground">Highland Honey</p>
                    <p className="text-[10px] text-muted-foreground">With morning tea</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full rounded-lg border border-border/30 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted">
              View Full Medical Profile
            </button>
          </div>

          <div className="mt-auto pt-8">
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">💡</span>
                <h4 className="text-[11px] font-bold text-secondary">Botanical Tip</h4>
              </div>
              <p className="text-[11px] italic leading-relaxed text-secondary/80">
                "Damakesse is known to clear respiratory pathways. Gently crush fresh leaves to release the essential oils."
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
