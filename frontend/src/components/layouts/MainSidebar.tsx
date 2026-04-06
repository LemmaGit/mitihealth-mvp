import { LogOut} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { useAuthStore } from "../../store/useAuthStore";

function MainSidebar({sidebarItems}: {sidebarItems: {label: string, href: string, icon: any; end?: boolean}[]}) {
   const { authUser } = useAuthStore();
   const { signOut } = useClerk()

    return (
    <aside className="hidden lg:flex flex-col justify-between bg-card p-4 border-border/15 border-r w-56 shrink-0">
      <div>
        <div className="mb-8 px-2">
          <h2 className="font-display font-bold text-foreground text-lg">Modern Herbalist</h2>
          <p className="text-muted-foreground text-xs uppercase tracking-wider">{String(authUser?.unsafeMetadata?.role || "")}</p>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center gap-3 hover:bg-muted px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground text-sm transition-colors ${
                  isActive ? "bg-muted text-foreground" : ""
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

      </div>

      <div className="space-y-2">
        <button onClick={() => signOut()} className="flex items-center gap-3 hover:bg-muted px-3 py-2.5 rounded-lg w-full text-muted-foreground text-sm transition-colors">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default MainSidebar
