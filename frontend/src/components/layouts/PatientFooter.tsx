import { Link } from "react-router-dom";

export function PatientFooter() {
  return (
    <footer className="bg-muted">
      <div className="heritage-divider" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-8">
        <Link to="/" className="font-display text-sm font-semibold text-primary">
          MitiHealth
        </Link>
        <nav className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Help Center"].map((item) => (
            <span key={item} className="text-xs text-muted-foreground">
              {item}
            </span>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © 2023 Botanical Editorial Collective. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
