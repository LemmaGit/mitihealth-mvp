import { useState } from "react";
import { Video, Info, Plus, ImageIcon, Paperclip, Mic, Send, Download, CheckCheck, Leaf, Search } from "lucide-react";
import Navbar from "../../components/Navbar";
import { chatContacts, chatThreads, type ChatContact, type ChatMessage } from "../../data/conversations";

const Messages = () => {
  const [activeContact, setActiveContact] = useState<ChatContact>(chatContacts[0]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(chatThreads);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentMessages = messages[activeContact.id] || [];

  const filteredContacts = chatContacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: currentMessages.length + 1,
      sender: "patient",
      text: newMessage,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };
    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), msg],
    }));
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-[72px] h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-80" : "w-0"} shrink-0 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col transition-all overflow-hidden`}>
          {/* Sidebar Header */}
          <div className="p-4 space-y-3">
            <h2 className="font-headline font-bold text-primary text-lg">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left ${
                  activeContact.id === contact.id
                    ? "bg-primary/5"
                    : "hover:bg-surface-container-low"
                }`}
              >
                <div className="relative shrink-0">
                  <img src={contact.image} alt={contact.name} className="w-11 h-11 rounded-full object-cover" width={44} height={44} />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-surface-container-lowest" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-headline font-semibold text-sm truncate ${
                      activeContact.id === contact.id ? "text-primary" : "text-foreground"
                    }`}>
                      {contact.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{contact.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span className="ml-2 shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="bg-surface-container-lowest/90 backdrop-blur-md shadow-sm px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-surface-container rounded-lg transition-all text-primary md:hidden"
              >
                ☰
              </button>
              <div className="relative">
                <img src={activeContact.image} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
                {activeContact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-surface-container-lowest" />
                )}
              </div>
              <div>
                <h2 className="font-headline font-bold text-primary text-sm leading-tight">{activeContact.name}</h2>
                <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground">
                  {activeContact.online ? "Online" : "Offline"} • {activeContact.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-surface-container rounded-lg transition-all text-primary">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-surface-container rounded-lg transition-all text-primary">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Pinned Insight */}
          <div className="px-6 pt-4">
            <div className="bg-tertiary/5 border-l-4 border-tertiary rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-start gap-3 relative z-10">
                <div className="bg-tertiary-container p-2 rounded-lg shrink-0">
                  <Leaf className="w-4 h-4 text-on-tertiary-container" />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-tertiary text-xs mb-0.5 uppercase tracking-wider">
                    Botanical Insight
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    Your practitioner may share herbal insights relevant to your treatment plan here.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex justify-center my-4">
              <span className="bg-surface-container-low px-4 py-1 rounded-full text-[10px] font-label uppercase tracking-widest text-muted-foreground">
                Today
              </span>
            </div>

            <div className="flex flex-col gap-5">
              {currentMessages.map((msg) => {
                if (msg.type === "document") {
                  return (
                    <div key={msg.id} className="flex items-end gap-3 max-w-[80%]">
                      <img src={activeContact.image} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" width={28} height={28} />
                      <div className="bg-surface-container-lowest rounded-xl p-3 flex items-center gap-3 shadow-sm">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Paperclip className="w-4 h-4 text-primary" />
                        </div>
                        <div className="grow">
                          <p className="text-xs font-semibold text-foreground">{msg.fileName}</p>
                          <p className="text-[10px] text-muted-foreground">{msg.fileSize} • Clinical Document</p>
                        </div>
                        <Download className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                      </div>
                    </div>
                  );
                }

                const isPatient = msg.sender === "patient";

                return (
                  <div key={msg.id} className={`flex ${isPatient ? "flex-col items-end ml-auto" : "items-end gap-3"} max-w-[80%]`}>
                    {!isPatient && (
                      <img src={activeContact.image} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" width={28} height={28} />
                    )}
                    <div className="flex flex-col gap-1">
                      <div
                        className={`p-3.5 rounded-2xl shadow-sm ${
                          isPatient
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-surface-container-low text-foreground rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${isPatient ? "justify-end mr-1" : "ml-1"}`}>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{msg.time}</span>
                        {isPatient && <CheckCheck className="w-3 h-3 text-primary" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input Bar */}
          <div className="bg-surface-container-low/90 backdrop-blur-xl pt-3 pb-6 px-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high text-muted-foreground transition-all">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high text-muted-foreground transition-all">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high text-muted-foreground transition-all">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <div className="grow relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-surface-container-lowest rounded-2xl px-5 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground transition-all shadow-sm"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-fixed text-primary hover:opacity-80 transition-all">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
