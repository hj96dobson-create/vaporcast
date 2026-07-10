import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92),rgba(14,165,233,0.25))] p-6 text-white shadow-[0_24px_100px_-48px_rgba(15,23,42,0.9)]">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Admin settings
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/75">
            Configure platform identity, provider integrations, rendering policy, security
            guardrails, and feature operations.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="ai">AI Providers</TabsTrigger>
            <TabsTrigger value="rendering">Rendering</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="features">Feature Flags</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">
                  General Settings
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Basic platform configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="Vaporcast" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input id="site-url" defaultValue="https://vaporcast.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" defaultValue="support@vaporcast.com" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new user signups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">Branding</CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Customize platform appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input id="logo-url" placeholder="https://..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="favicon-url">Favicon URL</Label>
                  <Input id="favicon-url" placeholder="https://..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input id="primary-color" type="color" defaultValue="#000000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Textarea id="tagline" placeholder="Platform tagline" rows={2} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">
                  Email Configuration
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  SMTP and email settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" type="number" defaultValue="587" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input id="smtp-user" placeholder="username" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input id="smtp-password" type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input id="from-email" placeholder="noreply@vaporcast.com" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">AI Providers</CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Configure AI service integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-950">Runway</h3>
                  <p className="mb-4 text-sm text-slate-600">Video generation service</p>
                  <div className="grid gap-2">
                    <Label htmlFor="runway-key">API Key</Label>
                    <Input id="runway-key" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-950">OpenAI</h3>
                  <p className="mb-4 text-sm text-slate-600">Text and script generation</p>
                  <div className="grid gap-2">
                    <Label htmlFor="openai-key">API Key</Label>
                    <Input id="openai-key" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rendering">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">
                  Rendering Settings
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Video rendering configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="max-duration">Max Video Duration (seconds)</Label>
                  <Input id="max-duration" type="number" defaultValue="60" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="default-quality">Default Quality</Label>
                  <select
                    id="default-quality"
                    className="flex h-11 w-full rounded-2xl border border-input/90 bg-white/85 px-3.5 py-2 text-sm shadow-[0_10px_40px_-28px_rgba(15,23,42,0.45)] outline-none transition focus:ring-2 focus:ring-ring/35"
                  >
                    <option value="720p">720p</option>
                    <option value="1080p" selected>
                      1080p
                    </option>
                    <option value="4k">4K</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Watermark Free Videos</Label>
                    <p className="text-sm text-muted-foreground">
                      Remove watermarks for paid plans
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">
                  Storage Settings
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  File storage configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="storage-provider">Storage Provider</Label>
                  <select
                    id="storage-provider"
                    className="flex h-11 w-full rounded-2xl border border-input/90 bg-white/85 px-3.5 py-2 text-sm shadow-[0_10px_40px_-28px_rgba(15,23,42,0.45)] outline-none transition focus:ring-2 focus:ring-ring/35"
                  >
                    <option value="supabase" selected>
                      Supabase Storage
                    </option>
                    <option value="s3">AWS S3</option>
                    <option value="gcs">Google Cloud Storage</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                  <Input id="max-file-size" type="number" defaultValue="500" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="retention-days">Video Retention (days)</Label>
                  <Input id="retention-days" type="number" defaultValue="90" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">
                  Security Settings
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Platform security configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="session-duration">Session Duration (hours)</Label>
                  <Input id="session-duration" type="number" defaultValue="24" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">
                  Maintenance Mode
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Control platform availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Take platform offline for maintenance
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maintenance-message">Maintenance Message</Label>
                  <Textarea
                    id="maintenance-message"
                    placeholder="Message shown to users during maintenance"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card className="border-white/70 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-slate-950">
                  Feature Flags
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Beta Features</Label>
                    <p className="text-sm text-muted-foreground">Enable experimental features</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>API Access</Label>
                    <p className="text-sm text-muted-foreground">Enable public API access</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics Dashboard</Label>
                    <p className="text-sm text-muted-foreground">Show analytics to users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Collaboration</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable team collaboration features
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button variant="outline" className="rounded-full border-slate-200 bg-white">
            Reset to Defaults
          </Button>
          <Button className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
            Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
