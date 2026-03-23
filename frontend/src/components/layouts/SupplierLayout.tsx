import { Outlet } from "react-router-dom";
import { SupplierSidebar } from "./SupplierSidebar";
import { SupplierTopbar } from "./SupplierTopbar";

export function SupplierLayout() {
  return (
    <div className="flex h-screen">
      <SupplierSidebar />
      <div className="flex flex-1 flex-col">
        <SupplierTopbar />
        <main className="flex-1 overflow-auto bg-background p-4 lg:p-8">
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
