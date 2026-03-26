import {
  Calendar,
  ClipboardList,
  MessageSquare,
  Package,
  ShieldCheck,
  ShoppingCart,
  UserRoundCog,
  Users,
} from "lucide-react";

const supplierSidebarItems = [
  { label: "Inventory", icon: ClipboardList, href: "/supplier" },
  { label: "Orders", icon: Calendar, href: "/supplier/orders" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
];

const practitionerSidebarItems = [
  { label: "Consultations", icon: Calendar, href: "/practitioner" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Profile", icon: UserRoundCog, href: "/practitioner/profile" },
];

const adminSidebarItems = [
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Practitioners", icon: ShieldCheck, href: "/admin/practitioner-verification" },
  { label: "Products", icon: Package, href: "/admin/product-verification" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
];

const patientSidebarItems = [
  // { label: "Dashboard", icon: LayoutDashboard, href: "/patient/dashboard" },
  { label: "Practitioners", icon: Users, href: "/patient/practitioners" },
  { label: "Marketplace", icon: Package, href: "/patient/marketplace" },
  { label: "Consultations", icon: Calendar, href: "/patient/consultations" },
  { label: "Orders", icon: ClipboardList, href: "/patient/orders" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Cart", icon: ShoppingCart, href: "/patient/cart" },
];

export const links: Record<string, { label: string; href: string; icon: any }[]> = {
  supplier: supplierSidebarItems,
  practitioner: practitionerSidebarItems,
  admin: adminSidebarItems,
  patient: patientSidebarItems,
};
