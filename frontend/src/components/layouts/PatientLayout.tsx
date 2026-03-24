import { Outlet } from "react-router-dom";
import MobileBottomNav from "../MobileBottomNav";
import Navbar from "../Navbar";

export function PatientLayout() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <MobileBottomNav />
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
