import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BellRing, LockKeyhole, Wand2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoRender, setAutoRender] = useState(true);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-[1.65rem] text-slate-950">Settings</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
            Refine notifications, automation, and workspace preferences without changing the current
            flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <BellRing className="h-5 w-5 text-sky-600" />
              <div>
                <p className="font-semibold text-slate-950">Email alerts</p>
                <p className="text-sm leading-6 text-slate-600">
                  Get notified when a render completes.
                </p>
              </div>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <Wand2 className="h-5 w-5 text-violet-600" />
              <div>
                <p className="font-semibold text-slate-950">Auto-render templates</p>
                <p className="text-sm leading-6 text-slate-600">
                  Preload your next video with a selected template.
                </p>
              </div>
            </div>
            <Switch checked={autoRender} onCheckedChange={setAutoRender} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
            <LockKeyhole className="h-3.5 w-3.5 text-cyan-300" />
            Workspace access
          </div>
          <CardTitle className="font-display text-2xl text-white">Profile and security</CardTitle>
          <CardDescription className="text-white/75">
            Keep auth and Supabase sessions intact while shaping the workspace experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name" className="text-white/85">
              Workspace name
            </Label>
            <Input
              id="workspace-name"
              defaultValue="Vaporcast Studio"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div className="rounded-2xl bg-white/5 p-4 text-sm leading-6 text-white/75">
            This settings screen is UI-only for now and is ready to connect to backend preferences
            later.
          </div>
          <Button className="w-full rounded-2xl bg-white text-slate-950 hover:bg-cyan-50">
            Save settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
