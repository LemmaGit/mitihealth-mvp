import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Practitioners", to: "/" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Messages", to: "/messages" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 w-full z-50 bg-primary-fixed/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tighter font-headline">
          Ethio-Botanica
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.to ||
              (link.to === "/" && location.pathname.startsWith("/practitioner")) ||
              (link.to === "/" && location.pathname.startsWith("/booking")) ||
              (link.to === "/marketplace" && location.pathname.startsWith("/marketplace"));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-headline font-semibold tracking-tight transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 hover:bg-primary/5 rounded-lg transition-all text-primary relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button className="p-2 hover:bg-primary/5 rounded-lg transition-all text-primary">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-10 w-10 rounded-full bg-primary-container overflow-hidden flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">AH</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
