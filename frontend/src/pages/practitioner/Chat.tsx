import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  LayoutDashboard, Calendar, MessageSquare, Pill, Settings, Send, Smile, ImagePlus, PlusCircle, MoreVertical, Monitor, User
} from "lucide-react";
import { NavLink } from "../../components/NavLink";
import { cn } from "../../lib/utils";

const sidebarNav = [
  { label: "Overview", icon: LayoutDashboard, href: "/practitioner/overview" },
  { label: "Appointments", icon: Calendar, href: "/practitioner/appointments" },
  { label: "Consultations", icon: MessageSquare, href: "/practitioner/chat" },
  { label: "Remedies", icon: Pill, href: "/practitioner/remedies" },
];

const messages = [
  {
    from: "patient",
    text: "Hello Dr. Abebe, I've been taking the Koseret tea as prescribed for three days now. The bloating has subsided, but I'm still feeling a bit of fatigue in the afternoons.",
    time: "09:12 AM",
  },
  {
    from: "doctor",
    text: "Good morning Amara. It's excellent that the bloating is easing. For the afternoon fatigue, let's try introducing a small amount of roasted Moringa leaf into your morning routine.",
    time: "09:15 AM",
    read: true,
  },
  {
    from: "doctor",
    text: "Could you please take a photo of the herbal mixture you currently have? I want to ensure the quality of the Koseret source.",
    time: "09:16 AM",
  },
  {
    from: "patient",
    type: "image",
    time: "09:18 AM",
    text: "Here it is. I bought it from the local market as you suggested.",
  },
];

const quickReplies = ["Yes, I have it", "Moringa sources?", "Dosage details", "Upload Report"];

export default function Chat() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      {/* <aside className="hidden w-56 flex-col border-r border-border/15 bg-card lg:flex">
        <div className="flex items-center gap-3 border-b border-border/15 p-4">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div>
            <p className="text-sm font-semibold">Amara Selassie</p>
            <p className="flex items-center gap-1 text-xs text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> ACTIVE CONSULTATION
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {sidebarNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
              activeClass="bg-muted text-foreground font-medium"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border/15 p-3">
          <NavLink
            to="/practitioner/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
            activeClass="bg-muted text-foreground"
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>

        <div className="border-t border-border/15 p-4">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Account</span>
          <p className="mt-1 text-sm font-semibold">Dr. Abebe Bekele</p>
          <button className="text-xs text-primary hover:underline">View Profile</button>
        </div>
      </aside> */}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        {/* <header className="flex h-16 items-center justify-between border-b border-border/15 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted lg:hidden" />
            <div className="lg:hidden">
              <p className="text-sm font-semibold">Amara Selassie</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="botanical-gradient text-primary-foreground">
              <Monitor size={16} /> Start Session
            </Button>
            <button className="rounded-lg p-2 hover:bg-muted">
              <MoreVertical size={18} className="text-muted-foreground" />
            </button>
          </div>
        </header> */}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-16">
          <div className="mx-auto max-w-3xl">
            {/* Date header */}
            <div className="mb-8 flex justify-center">
              <span className="rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
                TODAY, OCTOBER 24
              </span>
            </div>

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn("flex gap-3", msg.from === "doctor" ? "justify-end" : "justify-start")}
                >
                  {msg.from === "patient" && (
                    <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-muted" />
                  )}
                  <div className={cn("max-w-lg", msg.from === "doctor" ? "text-right" : "")}>
                    {msg.type === "image" ? (
                      <div className="overflow-hidden rounded-xl bg-muted">
                        <div className="aspect-4/3 bg-muted" />
                        <p className="px-3 py-2 text-left text-sm text-muted-foreground">{msg.text}</p>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "rounded-2xl px-5 py-3.5",
                          msg.from === "doctor"
                            ? "botanical-gradient text-primary-foreground"
                            : "bg-card shadow-botanical"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                    <p className={cn("mt-1 text-xs text-muted-foreground", msg.from === "doctor" ? "text-right" : "")}>
                      {msg.time}
                      {msg.read && " ✓✓"}
                    </p>
                  </div>
                  {msg.from === "doctor" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full botanical-gradient text-primary-foreground">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="mt-6 flex flex-wrap gap-2">
              {quickReplies.map((r) => (
                <button
                  key={r}
                  className="rounded-full bg-card px-4 py-2 text-sm shadow-botanical transition-colors hover:bg-muted"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-border/15 px-4 py-3 lg:px-6">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <button className="rounded-full p-2 text-muted-foreground hover:bg-muted">
              <PlusCircle size={20} />
            </button>
            <button className="rounded-full p-2 text-muted-foreground hover:bg-muted">
              <ImagePlus size={20} />
            </button>
            <div className="relative flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message Amara Selassie..."
                className="h-12 bg-muted pr-12 border-none"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Smile size={18} />
              </button>
            </div>
            <Button size="icon" className="h-12 w-12 rounded-full botanical-gradient text-primary-foreground">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
