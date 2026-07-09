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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Play,
  Download,
  Copy,
  RefreshCw,
  X,
  Eye,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/_admin/videos")({
  component: AdminVideos,
});

const mockVideos = [
  {
    id: 1,
    jobId: "job_12345",
    userId: "john@example.com",
    prompt: "Product launch video for tech startup",
    status: "completed",
    createdAt: "2024-06-15 10:30",
    duration: "30s",
    url: "https://example.com/video/12345.mp4",
  },
  {
    id: 2,
    jobId: "job_12346",
    userId: "sarah@example.com",
    prompt: "Social media ad for fashion brand",
    status: "processing",
    createdAt: "2024-06-15 11:00",
    duration: "15s",
    url: null,
  },
  {
    id: 3,
    jobId: "job_12347",
    userId: "mike@example.com",
    prompt: "Tutorial video for software product",
    status: "failed",
    createdAt: "2024-06-15 11:15",
    duration: "60s",
    url: null,
  },
  {
    id: 4,
    jobId: "job_12348",
    userId: "emma@example.com",
    prompt: "Corporate presentation video",
    status: "completed",
    createdAt: "2024-06-15 11:30",
    duration: "45s",
    url: "https://example.com/video/12348.mp4",
  },
  {
    id: 5,
    jobId: "job_12349",
    userId: "alex@example.com",
    prompt: "Promotional video for mobile app",
    status: "processing",
    createdAt: "2024-06-15 11:45",
    duration: "20s",
    url: null,
  },
];

function AdminVideos() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
            <p className="text-muted-foreground">Manage video renders and processing queue</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Video Management</CardTitle>
            <CardDescription>Monitor and manage all video generation jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>

              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search videos..." className="pl-10" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>

              <TabsContent value="all">
                <VideoTable videos={mockVideos} />
              </TabsContent>
              <TabsContent value="processing">
                <VideoTable videos={mockVideos.filter((v) => v.status === "processing")} />
              </TabsContent>
              <TabsContent value="completed">
                <VideoTable videos={mockVideos.filter((v) => v.status === "completed")} />
              </TabsContent>
              <TabsContent value="failed">
                <VideoTable videos={mockVideos.filter((v) => v.status === "failed")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function VideoTable({ videos }: { videos: typeof mockVideos }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "processing":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Prompt</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videos.map((video) => (
          <TableRow key={video.id}>
            <TableCell className="font-mono text-sm">{video.jobId}</TableCell>
            <TableCell>{video.userId}</TableCell>
            <TableCell className="max-w-xs truncate">{video.prompt}</TableCell>
            <TableCell>{getStatusBadge(video.status)}</TableCell>
            <TableCell>{video.createdAt}</TableCell>
            <TableCell>{video.duration}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {video.status === "completed" && (
                    <>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                      </DropdownMenuItem>
                    </>
                  )}
                  {video.status === "failed" && (
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </DropdownMenuItem>
                  )}
                  {video.status === "processing" && (
                    <DropdownMenuItem>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
