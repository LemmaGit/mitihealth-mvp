import { UserButton } from "@clerk/react";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";

function MainTopbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-white dark:ring-gray-900" />
            </button>
          </div>
          
          {/* User Button - Always visible on right */}
          <div className="flex items-center sm:flex">
            <UserButton 
              showName 
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-20 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl z-40 lg:hidden animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="p-4 space-y-2">
              <button 
                className="w-full flex items-center gap-3 rounded-xl p-3 text-muted-foreground hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => {
                  // Handle notification click
                  setIsMenuOpen(false);
                }}
              >
                <Bell size={20} />
                <span className="flex-1 text-left">Notifications</span>
                <span className="h-2 w-2 rounded-full bg-destructive" />
              </button>
              
              {/* Add more menu items here */}
              <div className="border-t border-white/20 dark:border-gray-700/30 my-2" />
              
              <button 
                className="w-full flex items-center gap-3 rounded-xl p-3 text-muted-foreground hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => {
                  // Handle settings click
                  setIsMenuOpen(false);
                }}
              >
                Settings
              </button>
              
              <button 
                className="w-full flex items-center gap-3 rounded-xl p-3 text-muted-foreground hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => {
                  // Handle help click
                  setIsMenuOpen(false);
                }}
              >
                Help & Support
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MainTopbar;