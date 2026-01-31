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
import { AlertTriangle, Search, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorLog {
  id: string;
  timestamp: string;
  errorCode: string;
  severity: "critical" | "warning" | "info";
  message: string;
  module: string;
  stackTrace?: string;
  affectedUsers?: number;
}

const ErrorLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  // Mock data - replace with actual API call
  const errorLogs: ErrorLog[] = [
    {
      id: "1",
      timestamp: "2025-01-31 15:45:22",
      errorCode: "DB_CONNECTION_001",
      severity: "critical",
      message: "Database connection timeout",
      module: "Database Service",
      stackTrace:
        "at connectDB (database.ts:45) at initializePool (database.ts:120)",
      affectedUsers: 127,
    },
    {
      id: "2",
      timestamp: "2025-01-31 15:30:10",
      errorCode: "API_TIMEOUT_002",
      severity: "warning",
      message: "API response time exceeded 5 seconds",
      module: "Product Service",
      affectedUsers: 23,
    },
    {
      id: "3",
      timestamp: "2025-01-31 14:20:45",
      errorCode: "AUTH_INVALID_TOKEN",
      severity: "warning",
      message: "Invalid JWT token detected",
      module: "Authentication",
      stackTrace: "at verifyToken (auth.ts:78) at middleware (auth.ts:156)",
      affectedUsers: 3,
    },
    {
      id: "4",
      timestamp: "2025-01-31 13:05:30",
      errorCode: "DISK_SPACE_LOW",
      severity: "critical",
      message: "Disk space running critically low (< 5% available)",
      module: "System Monitor",
      affectedUsers: 0,
    },
    {
      id: "5",
      timestamp: "2025-01-31 12:30:15",
      errorCode: "PAYMENT_GATEWAY_ERR",
      severity: "critical",
      message: "Payment gateway unavailable",
      module: "Payment Service",
      stackTrace:
        "at processPayment (payment.ts:234) at checkout (cart.ts:456)",
      affectedUsers: 45,
    },
    {
      id: "6",
      timestamp: "2025-01-31 11:15:00",
      errorCode: "CACHE_FLUSH_INFO",
      severity: "info",
      message: "Redis cache flushed successfully",
      module: "Cache Manager",
      affectedUsers: 0,
    },
    {
      id: "7",
      timestamp: "2025-01-31 10:00:22",
      errorCode: "EMAIL_SEND_FAILED",
      severity: "warning",
      message: "Failed to send notification email",
      module: "Email Service",
      stackTrace:
        "at sendEmail (mailer.ts:89) at notifyUser (notifications.ts:234)",
      affectedUsers: 12,
    },
  ];

  const filteredLogs = errorLogs.filter((log) => {
    const matchesSearch =
      log.errorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      severityFilter === "all" || log.severity === severityFilter;

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csv = [
      [
        "Timestamp",
        "Error Code",
        "Severity",
        "Message",
        "Module",
        "Affected Users",
      ],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.errorCode,
        log.severity,
        log.message,
        log.module,
        log.affectedUsers || 0,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `error-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      case "info":
        return "default";
      default:
        return "default";
    }
  };

  const criticalErrors = errorLogs.filter(
    (log) => log.severity === "critical",
  ).length;
  const warningErrors = errorLogs.filter(
    (log) => log.severity === "warning",
  ).length;
  const totalAffectedUsers = [
    ...new Set(errorLogs.flatMap((log) => Array(log.affectedUsers || 0))),
  ].length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Error Logs</h1>
        <p className="text-gray-500 mt-2">
          Monitor system health and error tracking
        </p>
      </div>

      {/* Critical Alert */}
      {criticalErrors > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {criticalErrors} critical error(s) that require immediate
            attention!
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorLogs.length}</div>
            <p className="text-xs text-gray-500 mt-1">Since last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-900">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalErrors}
            </div>
            <p className="text-xs text-red-600 mt-1">Requires action</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-900">
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {warningErrors}
            </div>
            <p className="text-xs text-yellow-600 mt-1">Monitor closely</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Affected Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {errorLogs.reduce(
                (sum, log) => sum + (log.affectedUsers || 0),
                0,
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Impacted today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Error Log Details</CardTitle>
          <CardDescription>System health and error tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by error code, message, or module..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
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
                  <TableHead>Error Code</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Affected Users</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className={log.severity === "critical" ? "bg-red-50" : ""}
                    >
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {log.errorCode}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.message}</TableCell>
                      <TableCell className="text-sm">{log.module}</TableCell>
                      <TableCell className="text-sm font-medium">
                        {log.affectedUsers ? `${log.affectedUsers} users` : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedError(log)}
                          className="gap-2"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No errors found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Error Details Modal */}
      {selectedError && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Error Details</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedError(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Error Code</p>
                <p className="font-mono font-medium">
                  {selectedError.errorCode}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Severity</p>
                <Badge variant={getSeverityColor(selectedError.severity)}>
                  {selectedError.severity}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timestamp</p>
                <p className="text-sm">{selectedError.timestamp}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Module</p>
                <p className="text-sm">{selectedError.module}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Message</p>
              <p className="text-sm bg-white p-3 rounded border">
                {selectedError.message}
              </p>
            </div>

            {selectedError.stackTrace && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Stack Trace</p>
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                  {selectedError.stackTrace}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorLogs;
