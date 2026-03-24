import { UserButton } from "@clerk/react";
import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { links } from "../../helper/routeLinks";
import { useAppApi } from "../../hooks/useAppApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function MainTopbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { authUser } = useAuthStore();
  const { socket } = useAuthStore();
  const { notification } = useAppApi();
  const queryClient = useQueryClient();
  const role = authUser?.unsafeMetadata?.role as string | undefined;
  const sidebarItems = role ? links[role] || [] : [];
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", "mine"],
    queryFn: () => notification.getMine(),
  });
  const unreadCount = (notifications as any[]).filter((n: any) => !n.isRead).length;
  const markReadMutation = useMutation({
    mutationFn: (id: string) => notification.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", "mine"] }),
  });
  const clearMutation = useMutation({
    mutationFn: (id: string) => notification.clearOne(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", "mine"] }),
  });

  useEffect(() => {
    if (!socket) return;
    const onNew = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "mine"] });
    };
    socket.on("notification:new", onNew);
    return () => {
      socket.off("notification:new", onNew);
    };
  }, [socket, queryClient]);

  return (
    <>
      <header className="fixed top-0 lg:top-4 right-0 lg:right-4 left-0 lg:left-auto z-50">
        <div className="flex h-16 items-center justify-between gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg px-4 lg:px-6">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative rounded-full p-2 text-muted-foreground hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          
          <button
            className="relative rounded-full p-2 text-muted-foreground hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => setIsNotificationsOpen((s) => !s)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          <div className="flex items-center sm:flex">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "ring-0",
                  userButtonTrigger: "hover:bg-white/20 dark:hover:bg-gray-800/50 rounded-full transition-colors p-1",
                }
              }} 
            />
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className="fixed top-20 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl z-40 lg:hidden animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="p-4 space-y-2">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 rounded-xl p-3 text-muted-foreground hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
      {isNotificationsOpen && (
        <div className="fixed right-4 top-20 z-50 w-80 rounded-xl border border-border/20 bg-card p-3 shadow-xl">
          <h3 className="mb-2 text-sm font-semibold">Notifications</h3>
          <div className="max-h-80 space-y-2 overflow-auto">
            {(notifications as any[]).map((n: any) => (
              <div key={n._id} className="rounded-lg border border-border/20 p-2">
                <p className="text-xs font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <div className="mt-2 flex gap-2">
                  {!n.isRead && (
                    <button className="text-[11px] text-primary" onClick={() => markReadMutation.mutate(n._id)}>
                      Mark read
                    </button>
                  )}
                  <button className="text-[11px] text-destructive" onClick={() => clearMutation.mutate(n._id)}>
                    Clear
                  </button>
                </div>
              </div>
            ))}
            {(notifications as any[]).length === 0 && (
              <p className="text-xs text-muted-foreground">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MainTopbar;