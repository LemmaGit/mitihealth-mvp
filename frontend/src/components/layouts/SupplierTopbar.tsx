import { UserButton, useUser } from "@clerk/react";
import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const topLinks = [
  { label: "Directory", href: "" },
  { label: "Herbal Hub", href: "inventory" },
  // { label: "Herbal Hub", href: "/product/1" },
  { label: "Marketplace", href: "/patient/orders" },
];
//TODO: make the card float in the right
export function SupplierTopbar() {
  // const { user } = useUser();
  return (
    <header className="flex h-16 items-center justify-between border-b border-border/15 bg-card px-4 lg:px-8 w-fit ml-auto rouunded-xl backdrop-blur-2xl">
      {/* <div className="flex items-center gap-6">
        <button className="lg:hidden">
          <Menu size={20} />
        </button>
        <span className="font-display text-sm font-semibold text-foreground">Supplier Overview</span>
        <nav className="hidden items-center gap-6 md:flex">
          {topLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div> */}

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="hidden items-center flex-col sm:flex">
            <UserButton showName appearance={{
              elements: {
                userButtonAvatarBox: "ring-0",
              }
            }} />
            {/* <p className="text-[10px] text-muted-foreground">{user?.unsafeMetadata?.role}</p> */}
        </div>
      </div>
    </header>
  );
}
