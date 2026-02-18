import { useState, useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-muted rounded-lg lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
        <div className="hidden md:flex items-center  rounded-md w-full max-w-md "></div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-foreground">
              {user?.full_name || "Admin User"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {user?.role || "Super Admin"}
            </p>
          </div>
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shadow-sm p-1 border border-border">
            <img
              src={user?.profile_picture || "/logo.svg"}
              alt="Avatar"
              className="w-full h-full object-contain rounded-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
