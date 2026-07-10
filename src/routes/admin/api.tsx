import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, AlertTriangle, Database, Cpu, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/api")({
  component: AdminAPI,
});

const providers = [
  {
    id: 1,
    name: "Runway",
    type: "Video Generation",
    status: "operational",
    latency: "2.3s",
    uptime: "99.9%",
    lastCheck: "2 min ago",
  },
  {
    id: 2,
    name: "Supabase",
    type: "Database & Auth",
    status: "operational",
    latency: "12ms",
    uptime: "99.95%",
    lastCheck: "1 min ago",
  },
  {
    id: 3,
    name: "OpenAI",
    type: "AI Services",
    status: "operational",
    latency: "450ms",
    uptime: "99.8%",
    lastCheck: "3 min ago",
  },
];

const envVars = [
  { name: "SUPABASE_URL", status: "configured", required: true },
  { name: "SUPABASE_ANON_KEY", status: "configured", required: true },
  { name: "RUNWAY_API_KEY", status: "configured", required: true },
  { name: "OPENAI_API_KEY", status: "configured", required: true },
  { name: "STORAGE_BUCKET", status: "configured", required: true },
  { name: "WEBHOOK_SECRET", status: "missing", required: false },
];

function AdminAPI() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "down":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500 hover:bg-green-600">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Degraded</Badge>;
      case "down":
        return <Badge variant="destructive">Down</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEnvStatusBadge = (status: string) => {
    switch (status) {
      case "configured":
        return <Badge className="bg-green-500 hover:bg-green-600">Configured</Badge>;
      case "missing":
        return <Badge variant="destructive">Missing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API</h1>
          <p className="text-muted-foreground">Monitor external API providers and configuration</p>
        </div>

        {/* API Providers */}
        <Card>
          <CardHeader>
            <CardTitle>API Providers</CardTitle>
            <CardDescription>Status of external service integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    {provider.name === "Runway" && (
                      <Cpu className="h-8 w-8 text-muted-foreground" />
                    )}
                    {provider.name === "Supabase" && (
                      <Database className="h-8 w-8 text-muted-foreground" />
                    )}
                    {provider.name === "OpenAI" && (
                      <Globe className="h-8 w-8 text-muted-foreground" />
                    )}
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium">{getStatusBadge(provider.status)}</p>
                      <p className="text-xs text-muted-foreground">Latency: {provider.latency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{provider.uptime}</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                    {getStatusIcon(provider.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Configuration and API keys health check</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {envVars.map((env) => (
                  <TableRow key={env.name}>
                    <TableCell className="font-mono text-sm">{env.name}</TableCell>
                    <TableCell>{env.required ? "Yes" : "No"}</TableCell>
                    <TableCell>{getEnvStatusBadge(env.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* TODO Markers */}
        <Card>
          <CardHeader>
            <CardTitle>Backend Integration</CardTitle>
            <CardDescription>TODO items for API management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• TODO: Implement real-time API health monitoring with webhook notifications</p>
            <p>• TODO: Add API rate limiting and quota management</p>
            <p>• TODO: Create API key rotation mechanism</p>
            <p>• TODO: Add API usage analytics and cost tracking</p>
            <p>• TODO: Implement automatic failover for degraded services</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
