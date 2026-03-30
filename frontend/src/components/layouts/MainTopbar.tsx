import { UserButton } from "@clerk/react";
import { Bell, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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

  const notificationMenuRef = useRef<HTMLDivElement>(null);

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

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
      <header className="top-0 lg:top-4 right-0 lg:right-4 left-0 lg:left-auto z-50 fixed">
        <div className="flex justify-between items-center gap-3 bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-blur-xl px-4 lg:px-6 border border-white/20 dark:border-gray-700/30 rounded-2xl h-16">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative hover:bg-white/20 dark:hover:bg-gray-800/50 p-2 rounded-full text-muted-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          
          {/* Mobile Notifications - Right Side */}
         
          
          {/* Desktop Notifications - Left Side */}
          <button
            className="hidden relative lg:flex hover:bg-white/20 dark:hover:bg-gray-800/50 p-2 rounded-full text-muted-foreground transition-colors"
            onClick={() => {
              setIsNotificationsOpen((s) => !s);
              // Auto-mark all notifications as read when opening
              (notifications as any[]).forEach((n: any) => {
                if (!n.isRead) {
                  markReadMutation.mutate(n._id);
                }
              });
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="-top-1 -right-1 absolute flex justify-center items-center bg-destructive px-1 rounded-full min-w-4 h-4 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
           <button
            className="lg:hidden relative hover:bg-white/20 dark:hover:bg-gray-800/50 p-2 rounded-full text-muted-foreground transition-colors"
            onClick={() => {
              setIsNotificationsOpen((s) => !s);
              // Auto-mark all notifications as read when opening
              (notifications as any[]).forEach((n: any) => {
                if (!n.isRead) {
                  markReadMutation.mutate(n._id);
                }
              });
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="-top-1 -right-1 absolute flex justify-center items-center bg-destructive px-1 rounded-full min-w-4 h-4 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="flex sm:flex items-center">
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
        </div>
      </header>

      {isMenuOpen && (
        <>
          <div 
            className="lg:hidden z-40 fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className="lg:hidden top-20 right-4 left-4 z-40 fixed bg-white/90 dark:bg-gray-900/90 slide-in-from-top-2 shadow-xl backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl animate-in duration-200 fade-in">
            <div className="space-y-2 p-4">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 hover:bg-white/20 dark:hover:bg-gray-800/50 p-3 rounded-xl w-full text-muted-foreground transition-colors"
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
        <div ref={notificationMenuRef} className="top-20 right-4 z-50 fixed bg-card shadow-xl p-3 border border-border/20 rounded-xl w-80">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="hover:bg-muted p-1 rounded-lg text-muted-foreground"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-auto">
            {(notifications as any[]).map((n: any) => (
              <div key={n._id} className="p-2 border border-border/20 rounded-lg">
                <p className="font-semibold text-xs">{n.title}</p>
                <p className="text-muted-foreground text-xs">{n.message}</p>
                <div className="flex gap-2 mt-2">
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
              <p className="text-muted-foreground text-xs">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MainTopbar;
