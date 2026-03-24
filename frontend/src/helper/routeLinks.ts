import {
  Calendar,
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShieldCheck,
  UserRoundCog,
  Users,
} from "lucide-react";

const supplierSidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/supplier" },
  { label: "Inventory", icon: ClipboardList, href: "/supplier/inventory" },
  { label: "Orders", icon: Calendar, href: "/supplier/orders" },
];

const practitionerSidebarItems = [
  { label: "Consultations", icon: Calendar, href: "/practitioner/chat" },
  { label: "Profile", icon: UserRoundCog, href: "/practitioner/profile" },
];

const adminSidebarItems = [
  { label: "Users", icon: Users, href: "/admin" },
  { label: "Practitioners", icon: ShieldCheck, href: "/admin/practitioner-verification" },
  { label: "Products", icon: Package, href: "/admin/product-verification" },
];

const patientSidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/patient/dashboard" },
  { label: "Practitioners", icon: Users, href: "/patient" },
  { label: "Marketplace", icon: Package, href: "/patient/marketplace" },
  { label: "Consultations", icon: Calendar, href: "/patient/consultations" },
  { label: "Orders", icon: ClipboardList, href: "/patient/orders" },
  { label: "Messages", icon: MessageSquare, href: "/patient/messages" },
];

export const links: Record<string, { label: string; href: string; icon: any }[]> = {
  supplier: supplierSidebarItems,
  practitioner: practitionerSidebarItems,
  admin: adminSidebarItems,
  patient: patientSidebarItems,
};
