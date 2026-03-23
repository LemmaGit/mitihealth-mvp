import { Outlet } from "react-router-dom";
import MainSidebar from "./MainSidebar";
import MainTopbar from "./MainTopbar";
import { links } from "../../helper/routeLinks";
import { useAuthStore } from "../../store/useAuthStore";

function MainLayout() {
    const {authUser:user} = useAuthStore()
    //@ts-ignore
    const sidebarItems = links[user?.unsafeMetadata?.role as string] || []
  return (
    <div className="flex h-screen">
      <MainSidebar sidebarItems={sidebarItems} />
      <div className="flex flex-1 flex-col">
        <MainTopbar />
        <main className="flex-1 overflow-auto bg-background p-4 lg:p-8 mt-16">
          <Outlet />
        </main>
        <footer className="border-t border-border/15 bg-card px-4 py-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
            {/* <span className="font-display font-semibold text-primary">Botanical Editorial</span> */}
            <span>© 2026 MitiHealth Systems</span>
            <div className="flex gap-4">
              <span>COMPLIANCE</span>
              <span>PRIVACY</span>
              <span>TERMS</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default MainLayout