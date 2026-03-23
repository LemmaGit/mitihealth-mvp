import { ShieldCheck } from "lucide-react";

export default function SidebarSettings() {
  return (
    <section className="rounded-xl bg-primary p-5 text-primary-foreground">
      <ShieldCheck size={24} className="mb-2" />
      <h3 className="font-display text-lg font-bold">Verified Supplier</h3>
      <p className="mt-2 text-sm leading-relaxed opacity-90">
        Ensure your product listing follows the Ethiopian Health Authority standards for traditional medicine practitioners.
      </p>
    </section>
  );
}
