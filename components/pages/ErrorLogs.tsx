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
import { Search, Download, Loader2, ChevronLeft, ChevronRight, AlertCircle, AlertTriangle, Eye, Terminal } from "lucide-react";
import { authApi } from "@/lib/auth-service";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequestLog {
  id: number;
  endpoint: string;
  method: string;
  ip_address: string;
  user_id: string;
  response_code: number;
  execution_time_ms: number;
  timestamp: string;
}

interface ErrorLog {
  id: number;
  request_log: RequestLog;
  error_message: string;
  traceback: string;
  severity: string;
  error_code: string;
  timestamp: string;
}

interface Summary {
  total_errors: number;
  critical_errors: number;
  warnings: number;
  affected_users: number;
  time_period_hours: number;
}

const ErrorLogs: React.FC = () => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const data = await authApi.getErrorLogs(page);
      setLogs(data.results || []);
      setSummary(data.summary || null);
      if (data.pagination) {
        setTotalPages(Math.ceil(data.pagination.count / 10)); // Assuming 10 per page
      }
    } catch (error) {
      console.error("Error fetching error logs:", error);
      toast.error("Failed to load error logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.error_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.error_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.request_log.endpoint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = severityFilter === "all" || log.severity === severityFilter;

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csv = [
      [
        "Timestamp",
        "Error Code",
        "Severity",
        "Message",
        "Endpoint",
        "Method",
        "User ID",
        "IP Address",
      ],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.error_code,
        log.severity,
        log.error_message,
        log.request_log.endpoint,
        log.request_log.method,
        log.request_log.user_id,
        log.request_log.ip_address,
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

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'error':
        return <Badge variant="destructive" className="font-black">CRITICAL</Badge>;
      case 'warning':
        return <Badge className="bg-orange-500 hover:bg-orange-600 font-black text-white">WARNING</Badge>;
      case 'info':
        return <Badge variant="secondary" className="font-black uppercase">INFO</Badge>;
      default:
        return <Badge variant="outline" className="font-black uppercase">{severity}</Badge>;
    }
  };

  const criticalCount = summary?.critical_errors || 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            System Error Analytics
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Deep diagnostic tracking and traceback analysis
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 font-bold h-11 px-6 border-2 hover:bg-muted transition-all">
          <Download className="h-4 w-4" />
          Export Diagnostic CSV
        </Button>
      </div>

      {criticalCount > 0 && (
        <Alert variant="destructive" className="border-4 shadow-xl bg-destructive/5 text-destructive animate-pulse border-destructive/50">
          <AlertCircle className="h-6 w-6" />
          <AlertDescription className="font-black text-lg ml-2">
            CRITICAL INCIDENT: {criticalCount} high-severity errors detected in the last {summary?.time_period_hours} hours.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-zinc-500/5 rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-none">Total Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">{summary.total_errors}</div>
              <p className="text-xs text-muted-foreground mt-1 font-bold">Past {summary.time_period_hours}H Period</p>
            </CardContent>
          </Card>
          <Card className="border-2 shadow-sm relative overflow-hidden group border-destructive/20 bg-destructive/[0.02]">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-destructive/10 rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-destructive uppercase tracking-widest leading-none">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-destructive">{summary.critical_errors}</div>
              <p className="text-xs text-destructive/70 mt-1 font-bold">Requires Action</p>
            </CardContent>
          </Card>
          <Card className="border-2 shadow-sm relative overflow-hidden group border-orange-200 bg-orange-50/30">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-orange-500/5 rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-orange-600 uppercase tracking-widest leading-none">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-orange-600">{summary.warnings}</div>
              <p className="text-xs text-orange-600/70 mt-1 font-bold">Non-Breaking Issues</p>
            </CardContent>
          </Card>
          <Card className="border-2 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-500/5 rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-blue-600 uppercase tracking-widest leading-none">Affected Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-blue-600">{summary.affected_users}</div>
              <p className="text-xs text-blue-600/70 mt-1 font-bold">User Impact Reach</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-2 shadow-md overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black">Error Diagnostic Feed</CardTitle>
              <CardDescription className="font-medium text-muted-foreground italic">Comprehensive system health log and request tracking</CardDescription>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by message, code, endpoint..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 w-full sm:w-[320px] border-2 focus-visible:ring-primary"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-11 border-2 font-bold">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 bg-muted/10">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground font-black tracking-tighter uppercase animate-pulse">Initializing Diagnostic Engine...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent border-b-2">
                    <TableHead className="font-black text-foreground py-4 text-xs uppercase tracking-tighter">Event Time</TableHead>
                    <TableHead className="font-black text-foreground text-xs uppercase tracking-tighter">Code</TableHead>
                    <TableHead className="font-black text-foreground text-xs uppercase tracking-tighter text-center">Severity</TableHead>
                    <TableHead className="font-black text-foreground text-xs uppercase tracking-tighter">Request Endpoint</TableHead>
                    <TableHead className="font-black text-foreground text-xs uppercase tracking-tighter">Summary</TableHead>
                    <TableHead className="font-black text-foreground text-xs uppercase tracking-tighter">Impact Info</TableHead>
                    <TableHead className="font-black text-foreground text-xs uppercase tracking-tighter text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className={`hover:bg-muted/30 transition-colors ${log.severity.toLowerCase() === 'critical' ? 'bg-destructive/[0.03]' : ''}`}>
                        <TableCell className="text-[11px] font-mono font-bold text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-bold border leading-none">
                            {log.error_code}
                          </code>
                        </TableCell>
                        <TableCell className="text-center">
                          {getSeverityBadge(log.severity)}
                        </TableCell>
                        <TableCell className="font-bold">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] py-0 px-1 border-primary/30 text-primary">{log.request_log.method}</Badge>
                            <span className="text-sm truncate max-w-[150px]" title={log.request_log.endpoint}>{log.request_log.endpoint}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className={`text-sm font-medium line-clamp-1 ${log.severity.toLowerCase() === 'critical' ? 'text-destructive' : 'text-foreground'}`} title={log.error_message}>
                            {log.error_message}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">User: {log.request_log.user_id}</span>
                            <span className="text-[10px] font-mono text-muted-foreground/70 uppercase leading-none">IP: {log.request_log.ip_address}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedError(log)}
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-20 bg-muted/5">
                        <div className="flex flex-col items-center gap-3">
                           <div className="p-5 bg-muted rounded-full">
                             <Search className="w-10 h-10 text-muted-foreground" />
                           </div>
                           <p className="text-xl font-black text-foreground italic">Diagnostic Search Empty</p>
                           <p className="text-muted-foreground font-medium">System records showing no matches for this configuration</p>
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
            Diagnostics Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
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

      {/* Error Detail Dialog */}
      <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 shadow-2xl">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-black flex items-center gap-3 mb-1">
                  {selectedError && getSeverityBadge(selectedError.severity)}
                  Diagnostic Trace: #{selectedError?.id}
                </DialogTitle>
                <DialogDescription className="font-bold text-muted-foreground italic">
                  Full system state at the time of event capture
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedError && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 leading-none">Response Information</p>
                  <p className="text-lg font-black leading-tight mb-1">HTTP {selectedError.request_log.response_code}</p>
                  <code className="text-xs font-bold text-primary">{selectedError.error_code}</code>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 leading-none">Execution Metrics</p>
                  <p className="text-lg font-black leading-tight mb-1">{selectedError.request_log.execution_time_ms.toFixed(2)} ms</p>
                  <p className="text-xs font-bold text-muted-foreground">{selectedError.request_log.method} Method</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 leading-none">Captured On</p>
                  <p className="text-sm font-black leading-tight mb-1">{new Date(selectedError.timestamp).toLocaleString()}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{selectedError.timestamp}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" /> Error Message
                </h3>
                <div className="p-4 bg-destructive/5 border-2 border-destructive/20 rounded-lg">
                  <p className="text-sm font-bold text-destructive leading-relaxed">
                    {selectedError.error_message}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" /> Traceback Analysis
                </h3>
                <div className="group relative">
                   <pre className="p-4 bg-zinc-950 text-emerald-400 font-mono text-[11px] leading-relaxed rounded-lg border-2 overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-700">
                    {selectedError.traceback}
                  </pre>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-7 text-[10px] font-black"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedError.traceback);
                        toast.success("Traceback copied to clipboard");
                      }}
                    >
                      COPY LOG
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary" /> Request Environment
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                   <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded border italic">
                      <span className="font-black text-muted-foreground uppercase text-[9px]">Endpoint</span>
                      <span className="font-bold truncate">{selectedError.request_log.endpoint}</span>
                   </div>
                   <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded border italic">
                      <span className="font-black text-muted-foreground uppercase text-[9px]">IP Address</span>
                      <span className="font-bold">{selectedError.request_log.ip_address}</span>
                   </div>
                   <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded border italic">
                      <span className="font-black text-muted-foreground uppercase text-[9px]">User Context</span>
                      <span className="font-bold">{selectedError.request_log.user_id}</span>
                   </div>
                   <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded border italic">
                      <span className="font-black text-muted-foreground uppercase text-[9px]">Log Identity</span>
                      <span className="font-bold">ID: {selectedError.id} / RID: {selectedError.request_log.id}</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ErrorLogs;
