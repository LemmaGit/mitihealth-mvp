import { UserButton } from "@clerk/react";
import { Bell } from "lucide-react";
export function SupplierTopbar() {
  return (
    <header className="ml-auto mt-4 mr-4 flex h-16 items-center justify-between rounded-2xl border border-border/15 bg-card/80 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="hidden items-center flex-col sm:flex">
            <UserButton appearance={{
              elements: {
                userButtonAvatarBox: "ring-0",
              }
            }} />
        </div>
      </div>
    </header>
  );
}
