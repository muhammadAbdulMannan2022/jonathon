"use client";

import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinDate: string;
  products: number;
}

export default function UserControl() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Seller",
      status: "active",
      joinDate: "2024-01-15",
      products: 12,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Seller",
      status: "active",
      joinDate: "2024-02-20",
      products: 8,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Buyer",
      status: "inactive",
      joinDate: "2023-12-10",
      products: 0,
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Seller",
      status: "active",
      joinDate: "2024-03-05",
      products: 15,
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Buyer",
      status: "active",
      joinDate: "2024-01-22",
      products: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "all" || user.role === filterRole;
    const matchStatus = filterStatus === "all" || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    );
  };

  const deleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">
          View, edit, and manage all users
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Products
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Join Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-muted transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm bg-muted text-foreground px-3 py-1 rounded">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-foreground">
                      {user.products}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        user.status === "active"
                          ? "bg-primary/20 text-primary"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-muted-foreground">
                      {user.joinDate}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded transition-colors"
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
