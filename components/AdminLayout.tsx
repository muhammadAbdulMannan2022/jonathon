import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function AdminLayout({
  children,
  currentPage,
  onPageChange,
}: AdminLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar - Responsive handling */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Sticky TopBar */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

