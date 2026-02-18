"use client";

import React, { useState, useEffect } from "react";
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
import { Search, Download, Loader2, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { authApi } from "@/lib/auth-service";
import { toast } from "sonner";

interface AuditLog {
  id: number;
  timestamp: string;
  user_email: string;
  action: string;
  target: string;
  details: string;
  status: string;
  ip_address: string;
}

interface Statistics {
  total_actions: number;
  total_successful: number;
  total_failed: number;
  total_unique_users: number;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const data = await authApi.getAuditLogs(page);
      setLogs(data.results.results || []);
      setStats(data.statistics || null);
      setTotalPages(Math.ceil(data.results.count / 10)); // Assuming 10 per page
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === "all" || log.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csv = [
      [
        "Timestamp",
        "User Email",
        "Action",
        "Target",
        "Details",
        "Status",
        "IP Address",
      ],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.user_email,
        log.action,
        log.target,
        log.details,
        log.status,
        log.ip_address,
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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>;
      case 'failure':
      case 'failed':
        return <Badge variant="destructive">Failure</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Track all system activities and administrative actions
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 font-bold h-11 px-6 border-2 hover:bg-muted transition-all">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary/5 rounded-full transition-transform group-hover:scale-110" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">{stats.total_actions}</div>
            </CardContent>
          </Card>
          <Card className="border-2 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-green-500/5 rounded-full transition-transform group-hover:scale-110" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-green-600">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-green-600">{stats.total_successful}</div>
            </CardContent>
          </Card>
          <Card className="border-2 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-red-500/5 rounded-full transition-transform group-hover:scale-110" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-red-600">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-red-600">{stats.total_failed}</div>
            </CardContent>
          </Card>
          <Card className="border-2 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-500/5 rounded-full transition-transform group-hover:scale-110" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-blue-600">Unique Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-blue-600">{stats.total_unique_users}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-2 shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black">Activity History</CardTitle>
              <CardDescription className="font-medium text-muted-foreground">Detailed record of system operations</CardDescription>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 w-full sm:w-[300px] border-2 focus-visible:ring-primary"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-11 border-2 font-bold">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground font-bold animate-pulse">Fetching system logs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent border-b-2">
                    <TableHead className="font-black text-foreground py-4">Timestamp</TableHead>
                    <TableHead className="font-black text-foreground">User Email</TableHead>
                    <TableHead className="font-black text-foreground">Action</TableHead>
                    <TableHead className="font-black text-foreground">Target</TableHead>
                    <TableHead className="font-black text-foreground">Details</TableHead>
                    <TableHead className="font-black text-foreground text-center">Status</TableHead>
                    <TableHead className="font-black text-foreground">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-bold text-foreground">{log.user_email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                            {log.action.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">{log.target}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm font-medium text-muted-foreground line-clamp-2" title={log.details}>
                            {log.details}
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(log.status)}
                        </TableCell>
                        <TableCell className="text-sm font-mono font-medium text-muted-foreground uppercase">{log.ip_address}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2">
                           <div className="p-4 bg-muted rounded-full">
                             <Search className="w-8 h-8 text-muted-foreground" />
                           </div>
                           <p className="text-lg font-bold text-foreground">No logs found</p>
                           <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-card border-2 p-4 rounded-xl shadow-sm">
          <p className="text-sm text-muted-foreground font-bold">
            Showing Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="gap-1 font-bold h-10 px-4 border-2 transition-all hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex gap-1 hidden sm:flex">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = currentPage;
                if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                
                if (pageNum <= 0 || pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 font-bold border-2 ${currentPage === pageNum ? 'bg-primary border-primary shadow-md shadow-primary/20' : 'hover:bg-muted'}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="gap-1 font-bold h-10 px-4 border-2 transition-all hover:bg-muted"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
