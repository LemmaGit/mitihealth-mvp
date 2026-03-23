import { LayoutDashboard, Calendar, ClipboardList, BarChart3, MessageSquare } from "lucide-react";

//TODO: add orders page 
const supplierSidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/supplier/" },
  // { label: "Appointments", icon: Calendar, href: "/supplier/appointments" },
  { label: "Inventory", icon: ClipboardList, href: "/supplier/inventory" },
  // { label: "Analytics", icon: BarChart3, href: "/supplier/analytics" },
  { label: "Messages", icon: MessageSquare, href: "/supplier/messages" },
];

const patientSidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/patient/dashboard" },
  { label: "Appointments", icon: Calendar, href: "/patient/appointments" },
  { label: "Inventory", icon: ClipboardList, href: "/patient/inventory" },
  { label: "Analytics", icon: BarChart3, href: "/patient/analytics" },
  { label: "Messages", icon: MessageSquare, href: "/patient/messages" },
];

export const links = {
    supplier: supplierSidebarItems,
    patient: patientSidebarItems,
}
