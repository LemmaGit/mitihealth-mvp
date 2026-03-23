import { Bell, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
  
const navLinks = [
  { label: "Directory", href: "/patient/consultations" },
  { label: "Herbal Hub", href: "/product/1" },
  { label: "Marketplace", href: "/patient/orders" },
];

export function PatientNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="font-display text-xl font-bold text-foreground">
          Botanical Editorial
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell size={20} />
          </button>
          <button className="rounded-full bg-foreground p-2 text-background">
            <User size={18} />
          </button>
          <button
            className="rounded-md p-2 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block py-3 text-sm font-medium text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div className="heritage-divider" />
    </header>
  );
}
