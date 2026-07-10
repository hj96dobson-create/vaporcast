import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, Copy, Eye, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/avatars")({
  component: AdminAvatars,
});

const mockAvatars = [
  {
    id: 1,
    name: "Professional Male",
    category: "Business",
    thumbnail: "👨‍💼",
    language: "English",
    voice: "Deep",
    status: "active",
  },
  {
    id: 2,
    name: "Professional Female",
    category: "Business",
    thumbnail: "👩‍💼",
    language: "English",
    voice: "Clear",
    status: "active",
  },
  {
    id: 3,
    name: "Casual Male",
    category: "Social",
    thumbnail: "👨",
    language: "English",
    voice: "Friendly",
    status: "active",
  },
  {
    id: 4,
    name: "Casual Female",
    category: "Social",
    thumbnail: "👩",
    language: "English",
    voice: "Warm",
    status: "active",
  },
  {
    id: 5,
    name: "Corporate Spokesperson",
    category: "Corporate",
    thumbnail: "🎤",
    language: "English",
    voice: "Authoritative",
    status: "active",
  },
];

function AdminAvatars() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Avatars</h1>
            <p className="text-muted-foreground">Manage AI avatar library</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Avatar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Avatar Library</CardTitle>
            <CardDescription>Browse and manage available AI avatars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search avatars..." className="pl-10" />
              </div>
              <Button variant="outline">Filter by Category</Button>
              <Button variant="outline">Filter by Language</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockAvatars.map((avatar) => (
                <Card key={avatar.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-4xl">
                        {avatar.thumbnail}
                      </div>
                      <Badge variant={avatar.status === "active" ? "default" : "secondary"}>
                        {avatar.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{avatar.name}</CardTitle>
                    <CardDescription>{avatar.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Language:</span>
                        <span>{avatar.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Voice:</span>
                        <span>{avatar.voice}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* TODO: Backend Integration */}
            <div className="mt-8 rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                TODO: Connect to backend API for avatar management, upload functionality, and
                cloning capabilities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
