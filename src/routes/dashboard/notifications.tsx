import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CheckCircle2, Clock3, MessageSquareText, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

const notifications = [
  {
    title: "Render completed",
    body: "Holiday campaign cut is ready for export.",
    time: "2m ago",
    icon: CheckCircle2,
    tone: "text-emerald-600",
  },
  {
    title: "Queue update",
    body: "Two jobs moved from queued to processing.",
    time: "10m ago",
    icon: Clock3,
    tone: "text-sky-600",
  },
  {
    title: "Template feedback",
    body: "Your team commented on Product Launch v2.",
    time: "24m ago",
    icon: MessageSquareText,
    tone: "text-violet-600",
  },
];

function NotificationsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-[1.65rem] text-slate-950">
            Notifications
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
            Keep up with render updates, team feedback, and account activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Icon className={`h-4 w-4 ${item.tone}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
            <BellRing className="h-3.5 w-3.5 text-cyan-300" />
            Live updates
          </div>
          <CardTitle className="font-display text-2xl text-white">
            Notification preferences
          </CardTitle>
          <CardDescription className="text-white/75">
            Choose where updates are delivered while preserving render and polling behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Render complete alerts",
            "Queue status changes",
            "Team comments",
            "Billing reminders",
          ].map((rule) => (
            <div key={rule} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
              {rule}
            </div>
          ))}
          <Button className="mt-2 w-full rounded-2xl bg-white text-slate-950 hover:bg-cyan-50">
            Save preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
