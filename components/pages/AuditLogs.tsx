"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
  status: "success" | "failure";
  ipAddress: string;
}

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  // Mock data - replace with actual API call
  const auditLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: "2025-01-31 14:30:45",
      user: "admin@example.com",
      action: "Product Updated",
      target: "Product ID: 101",
      details: "Price changed from $99 to $129",
      status: "success",
      ipAddress: "192.168.1.1",
    },
    {
      id: "2",
      timestamp: "2025-01-31 13:15:22",
      user: "seller@shop.com",
      action: "Product Created",
      target: "New Product: Wireless Headphones",
      details: "Added product to inventory",
      status: "success",
      ipAddress: "192.168.1.5",
    },
    {
      id: "3",
      timestamp: "2025-01-31 12:00:10",
      user: "admin@example.com",
      action: "User Deleted",
      target: "User ID: 456",
      details: "Account removed from system",
      status: "success",
      ipAddress: "192.168.1.1",
    },
    {
      id: "4",
      timestamp: "2025-01-31 10:45:30",
      user: "manager@example.com",
      action: "Settings Changed",
      target: "Store Settings",
      details: "Commission rate updated to 15%",
      status: "success",
      ipAddress: "192.168.1.10",
    },
    {
      id: "5",
      timestamp: "2025-01-30 16:20:15",
      user: "seller@shop.com",
      action: "Login Failed",
      target: "User Session",
      details: "Invalid password attempt",
      status: "failure",
      ipAddress: "192.168.2.3",
    },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = actionFilter === "all" || log.status === actionFilter;

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csv = [
      [
        "Timestamp",
        "User",
        "Action",
        "Target",
        "Details",
        "Status",
        "IP Address",
      ],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.user,
        log.action,
        log.target,
        log.details,
        log.status,
        log.ipAddress,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-gray-500 mt-2">
          Track all system activities and user actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>
            Complete record of who did what and when
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-sm">{log.target}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {log.details}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === "success" ? "default" : "destructive"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No logs found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Actions</p>
              <p className="text-2xl font-bold">{auditLogs.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600">
                {auditLogs.filter((l) => l.status === "success").length}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {auditLogs.filter((l) => l.status === "failure").length}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(auditLogs.map((l) => l.user)).size}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
