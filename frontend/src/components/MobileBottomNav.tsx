import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Leaf, MessageCircle, User } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, to: "/dashboard" },
  { label: "Find", icon: Search, to: "/" },
  { label: "Shop", icon: Leaf, to: "/marketplace" },
  { label: "Chat", icon: MessageCircle, to: "/messages" },
  { label: "Account", icon: User, to: "/account" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/" || location.pathname.startsWith("/practitioner") || location.pathname.startsWith("/booking");
    if (to === "/marketplace") return location.pathname.startsWith("/marketplace") || location.pathname === "/cart";
    return location.pathname === to;
  };

  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-lg shadow-[0_-10px_30px_-15px_rgba(0,76,34,0.1)] rounded-t-2xl pb-6 pt-2 px-4">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all ${
                active
                  ? "bg-primary-fixed/40 text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-label font-medium uppercase tracking-widest mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default MobileBottomNav;
