import { LayoutDashboard, Calendar, ClipboardList, BarChart3, MessageSquare, Settings, HelpCircle, LogOut, Plus } from "lucide-react";
import { NavLink } from "../NavLink";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/supplier/dashboard" },
  { label: "Appointments", icon: Calendar, href: "/supplier/appointments" },
  { label: "Inventory", icon: ClipboardList, href: "/supplier/inventory" },
  { label: "Analytics", icon: BarChart3, href: "/supplier/analytics" },
  { label: "Messages", icon: MessageSquare, href: "/supplier/messages" },
];

export function SupplierSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col justify-between border-r border-border/15 bg-card p-4 lg:flex">
      <div>
        <div className="mb-8 px-2">
          <h2 className="font-display text-lg font-bold text-foreground">Modern Herbalist</h2>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Practitioner Portal</p>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeClass="bg-muted text-foreground font-medium"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 px-1">
          <NavLink
            to="/supplier/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            activeClass="bg-muted text-foreground font-medium"
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>

      <div className="space-y-2">
        <Button className="w-full botanical-gradient text-primary-foreground" asChild>
          <Link to="/practitioner/chat">
            <Plus size={16} />
            New Consultation
          </Link>
        </Button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
          <HelpCircle size={18} />
          <span>Support</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
