import { ReactNode } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  CheckCircle2,
  PackageSearch,
  LogOut,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "add-product",
    label: "Add Product",
    icon: <PlusCircle className="w-5 h-5" />,
  },
  { id: "users", label: "User Control", icon: <Users className="w-5 h-5" /> },
  {
    id: "approvals",
    label: "Product Approval",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  {
    id: "products",
    label: "Manage Products",
    icon: <PackageSearch className="w-5 h-5" />,
  },
  {
    id: "audit-logs",
    label: "Audit Logs",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "error-logs",
    label: "Error Logs",
    icon: <AlertCircle className="w-5 h-5" />,
  },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-full shadow-lg shadow-black/5">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src="/logo.svg"
              alt="J Logo"
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-lg font-black text-foreground tracking-tight">
              J-DEALS
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] -mt-1">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
          Main Menu
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              currentPage === item.id
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span
              className={`transition-transform duration-200 group-hover:scale-110 ${
                currentPage === item.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-primary"
              }`}
            >
              {item.icon}
            </span>
            <span className="font-bold text-sm tracking-tight">
              {item.label}
            </span>
            {currentPage === item.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group">
          <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
