import { Outlet } from "react-router-dom";
import MainSidebar from "./MainSidebar";
import MainTopbar from "./MainTopbar";
import { PropagateLoader } from "react-spinners";
import { links } from "../../helper/routeLinks";
import { useAuthStore } from "../../store/useAuthStore";
import { Suspense } from "react";

function MainLayout() {
    const {authUser:user} = useAuthStore()
    //@ts-ignore
    const sidebarItems = links[user?.unsafeMetadata?.role as string] || []
  return (
    <div className="flex h-screen">
      <MainSidebar sidebarItems={sidebarItems} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <MainTopbar />
        <main className="flex-1 bg-background mt-16 p-4 lg:p-8 overflow-auto">
          <Suspense fallback={<div className="flex justify-center items-center h-full"><PropagateLoader color="#004c22" /></div>}>
            <Outlet />
          </Suspense>
        </main>
        <footer className="bg-card px-4 lg:px-8 py-4 border-border/15 border-t">
          <div className="flex sm:flex-row flex-col justify-between items-center gap-2 text-muted-foreground text-xs">
            <span> 2026 MitiHealth Systems</span>
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