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
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Trash2,
  Key,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

const mockUsers = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    plan: "Pro",
    createdAt: "2024-01-15",
    videosGenerated: 45,
    status: "active",
  },
  {
    id: 2,
    username: "sarah_smith",
    email: "sarah@example.com",
    plan: "Free",
    createdAt: "2024-02-20",
    videosGenerated: 12,
    status: "active",
  },
  {
    id: 3,
    username: "mike_wilson",
    email: "mike@example.com",
    plan: "Enterprise",
    createdAt: "2024-03-10",
    videosGenerated: 156,
    status: "active",
  },
  {
    id: 4,
    username: "emma_jones",
    email: "emma@example.com",
    plan: "Pro",
    createdAt: "2024-04-05",
    videosGenerated: 67,
    status: "suspended",
  },
  {
    id: 5,
    username: "alex_brown",
    email: "alex@example.com",
    plan: "Free",
    createdAt: "2024-05-12",
    videosGenerated: 8,
    status: "active",
  },
];

function AdminUsers() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Users
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Manage user accounts and permissions.
            </p>
          </div>
        </div>

        <Card className="border-white/70 bg-white/90 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-slate-950">All users</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
              View and manage all registered users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-10" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full border-slate-200 bg-white">
                  Filter
                </Button>
                <Button variant="outline" className="rounded-full border-slate-200 bg-white">
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Videos Generated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-slate-950">{user.username}</TableCell>
                    <TableCell className="text-slate-600 break-all">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.plan === "Enterprise" ? "default" : "secondary"}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">
                      {user.createdAt}
                    </TableCell>
                    <TableCell>{user.videosGenerated}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "destructive"}
                        className={
                          user.status === "active" ? "bg-green-500 hover:bg-green-600" : undefined
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Upgrade Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Downgrade Plan
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
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

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-600">Showing 1-5 of 2,847 users</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="rounded-full border-slate-200 bg-white"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-slate-200 bg-white"
                >
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
