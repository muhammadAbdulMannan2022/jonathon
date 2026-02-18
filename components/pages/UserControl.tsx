"use client";

import { useState, useEffect } from "react";
import { authApi } from "@/lib/auth-service";
import { toast } from "sonner";
import { Loader2, Search, Trash2, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: number;
  full_name: string | null;
  email: string;
  role: string;
  user_product_count: number;
  date_joined: string;
  is_active: boolean;
}

export default function UserControl() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState<string | null>(null);
  const [hasPrevious, setHasPrevious] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.getUsers(currentPage, searchTerm);
      setUsers(response.results);
      setTotalCount(response.count);
      setHasNext(response.next);
      setHasPrevious(response.previous);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  const handleAction = async (action: 'suspend' | 'reactivate' | 'delete', userId: number) => {
    try {
      if (action === 'suspend') {
        await authApi.suspendUser(userId);
        toast.success("User suspended successfully");
      } else if (action === 'reactivate') {
        await authApi.reactivateUser(userId);
        toast.success("User reactivated successfully");
      } else if (action === 'delete') {
        if (!confirm("Are you sure you want to delete this user?")) return;
        await authApi.deleteUser(userId);
        toast.success("User deleted successfully");
      }
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage user accounts, roles, and statuses.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-muted-foreground">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{user.full_name || 'N/A'}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-foreground">{user.user_product_count}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {user.is_active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.date_joined).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.is_active ? (
                          <button
                            onClick={() => handleAction('suspend', user.id)}
                            className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-md transition-colors"
                            title="Suspend User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction('reactivate', user.id)}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-md transition-colors"
                            title="Reactivate User"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleAction('delete', user.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{users.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrevious}
              className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-2">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasNext}
              className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
