import type{ ReactNode } from "react";
import { PatientNavbar } from "./PatientNavbar";
import { PatientFooter } from "./PatientFooter";

export function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PatientNavbar />
      <main className="flex-1">{children}</main>
      <PatientFooter />
    </div>
  );
}
