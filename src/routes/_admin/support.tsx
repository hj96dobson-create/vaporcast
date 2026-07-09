import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Search, MessageSquare, Bug, Lightbulb, Mail } from "lucide-react";

export const Route = createFileRoute("/_admin/support")({
  component: AdminSupport,
});

const mockFeedback = [
  {
    id: 1,
    type: "feedback",
    user: "john@example.com",
    subject: "Great platform!",
    message: "Love the new features, keep up the good work.",
    status: "new",
    createdAt: "2024-06-15 10:30",
  },
  {
    id: 2,
    type: "feedback",
    user: "sarah@example.com",
    subject: "Feature request",
    message: "Would love to see more avatar options.",
    status: "reviewed",
    createdAt: "2024-06-15 09:15",
  },
];

const mockBugs = [
  {
    id: 1,
    type: "bug",
    user: "mike@example.com",
    subject: "Video rendering stuck",
    message: "My video has been processing for over 10 minutes.",
    status: "open",
    priority: "high",
    createdAt: "2024-06-15 11:00",
  },
  {
    id: 2,
    type: "bug",
    user: "emma@example.com",
    subject: "Login issue",
    message: "Unable to login with Google OAuth.",
    status: "in_progress",
    priority: "medium",
    createdAt: "2024-06-15 10:45",
  },
];

const mockContactRequests = [
  {
    id: 1,
    type: "contact",
    user: "alex@example.com",
    subject: "Enterprise inquiry",
    message: "Interested in enterprise plan for our company.",
    status: "new",
    createdAt: "2024-06-15 11:20",
  },
];

const mockFeatureRequests = [
  {
    id: 1,
    type: "feature",
    user: "john@example.com",
    subject: "Bulk video generation",
    message: "Need ability to generate multiple videos at once.",
    status: "planned",
    votes: 45,
    createdAt: "2024-06-14 15:30",
  },
  {
    id: 2,
    type: "feature",
    user: "sarah@example.com",
    subject: "Custom avatar upload",
    message: "Allow users to upload their own avatars.",
    status: "under_review",
    votes: 32,
    createdAt: "2024-06-13 09:00",
  },
];

function AdminSupport() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground">
            Manage user feedback, bug reports, and support requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Support Queue</CardTitle>
            <CardDescription>View and respond to user inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="bugs">Bug Reports</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="features">Feature Requests</TabsTrigger>
              </TabsList>

              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search support requests..." className="pl-10" />
                </div>
                <Button variant="outline">Filter by Status</Button>
                <Button variant="outline">Filter by Priority</Button>
              </div>

              <TabsContent value="all">
                <SupportTable
                  items={[
                    ...mockFeedback,
                    ...mockBugs,
                    ...mockContactRequests,
                    ...mockFeatureRequests,
                  ]}
                />
              </TabsContent>
              <TabsContent value="feedback">
                <SupportTable items={mockFeedback} />
              </TabsContent>
              <TabsContent value="bugs">
                <SupportTable items={mockBugs} showPriority />
              </TabsContent>
              <TabsContent value="contact">
                <SupportTable items={mockContactRequests} />
              </TabsContent>
              <TabsContent value="features">
                <SupportTable items={mockFeatureRequests} showVotes />
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Showing 1-5 of 234 requests</p>
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

        {/* Quick Reply */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reply</CardTitle>
            <CardDescription>Send a response to a user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="reply-to">Reply To</label>
              <Input id="reply-to" placeholder="user@example.com" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="reply-subject">Subject</label>
              <Input id="reply-subject" placeholder="Response to your inquiry" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="reply-message">Message</label>
              <Textarea id="reply-message" placeholder="Type your response..." rows={4} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button>Send Reply</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

interface SupportItem {
  id: number;
  type: string;
  user: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  priority?: string;
  votes?: number;
}

function SupportTable({
  items,
  showPriority = false,
  showVotes = false,
}: {
  items: SupportItem[];
  showPriority?: boolean;
  showVotes?: boolean;
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feedback":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "bug":
        return <Bug className="h-4 w-4 text-red-500" />;
      case "contact":
        return <Mail className="h-4 w-4 text-green-500" />;
      case "feature":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
      case "open":
        return <Badge variant="destructive">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">In Progress</Badge>;
      case "reviewed":
        return <Badge className="bg-green-500 hover:bg-green-600">Reviewed</Badge>;
      case "planned":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Planned</Badge>;
      case "under_review":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Under Review</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Subject</TableHead>
          {showPriority && <TableHead>Priority</TableHead>}
          {showVotes && <TableHead>Votes</TableHead>}
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getTypeIcon(item.type)}
                <span className="capitalize">{item.type}</span>
              </div>
            </TableCell>
            <TableCell>{item.user}</TableCell>
            <TableCell className="max-w-xs truncate">{item.subject}</TableCell>
            {showPriority && <TableCell>{getPriorityBadge(item.priority ?? "low")}</TableCell>}
            {showVotes && <TableCell>{item.votes}</TableCell>}
            <TableCell>{getStatusBadge(item.status)}</TableCell>
            <TableCell>{item.createdAt}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
