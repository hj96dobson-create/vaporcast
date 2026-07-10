import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/logs")({
  component: AdminLogs,
});

const mockLogs = [
  {
    id: 1,
    level: "error",
    message: "Video generation failed for job_12347",
    timestamp: "2024-06-15 11:15:23",
    source: "video-worker",
    userId: "mike@example.com",
  },
  {
    id: 2,
    level: "warning",
    message: "API rate limit approaching for user john@example.com",
    timestamp: "2024-06-15 11:10:45",
    source: "api",
    userId: "john@example.com",
  },
  {
    id: 3,
    level: "info",
    message: "User sarah@example.com upgraded to Pro plan",
    timestamp: "2024-06-15 11:05:12",
    source: "billing",
    userId: "sarah@example.com",
  },
  {
    id: 4,
    level: "info",
    message: "New user registration: alex@example.com",
    timestamp: "2024-06-15 11:00:33",
    source: "auth",
    userId: "alex@example.com",
  },
  {
    id: 5,
    level: "success",
    message: "Video job_12345 completed successfully",
    timestamp: "2024-06-15 10:45:18",
    source: "video-worker",
    userId: "john@example.com",
  },
];

function AdminLogs() {
  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>;
      case "success":
        return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground">System events and activity logs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>View and filter platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
                <TabsTrigger value="warnings">Warnings</TabsTrigger>
                <TabsTrigger value="auth">Auth Events</TabsTrigger>
                <TabsTrigger value="render">Render Events</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-10" />
                </div>
                <Button variant="outline">Filter by Date</Button>
                <Button variant="outline">Filter by Source</Button>
              </div>

              <TabsContent value="all">
                <LogsTable logs={mockLogs} />
              </TabsContent>
              <TabsContent value="errors">
                <LogsTable logs={mockLogs.filter((l) => l.level === "error")} />
              </TabsContent>
              <TabsContent value="warnings">
                <LogsTable logs={mockLogs.filter((l) => l.level === "warning")} />
              </TabsContent>
              <TabsContent value="auth">
                <LogsTable logs={mockLogs.filter((l) => l.source === "auth")} />
              </TabsContent>
              <TabsContent value="render">
                <LogsTable logs={mockLogs.filter((l) => l.source === "video-worker")} />
              </TabsContent>
              <TabsContent value="system">
                <LogsTable
                  logs={mockLogs.filter((l) => l.source === "api" || l.source === "billing")}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Showing 1-5 of 1,234 logs</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function LogsTable({ logs }: { logs: typeof mockLogs }) {
  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>;
      case "success":
        return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Level</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getLevelIcon(log.level)}
                {getLevelBadge(log.level)}
              </div>
            </TableCell>
            <TableCell className="max-w-md truncate">{log.message}</TableCell>
            <TableCell>
              <Badge variant="outline">{log.source}</Badge>
            </TableCell>
            <TableCell>{log.userId}</TableCell>
            <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
