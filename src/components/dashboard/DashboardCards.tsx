import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthUser } from "@/hooks/useAuthUser";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  CreditCard,
  Lightbulb,
  Sparkles,
  Video,
  Wand2,
} from "lucide-react";

export function DashboardCards() {
  const { isAdmin, loading: authLoading } = useAuthUser();
  const creditValue = authLoading ? "—" : isAdmin ? "∞ Unlimited" : "1,120";
  const creditDetail = authLoading
    ? "Checking account"
    : isAdmin
      ? "Zero cost for admin"
      : "Resets in 12 days";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Videos this month", value: "214", detail: "+18%", icon: Video },
          { label: "Render queue", value: "3", detail: "2 processing", icon: Clock3 },
          {
            label: "Credits remaining",
            value: creditValue,
            detail: creditDetail,
            icon: CreditCard,
          },
          { label: "Success rate", value: "98.4%", detail: "Last 30 days", icon: CheckCircle2 },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-white/70 bg-white/85 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur"
            >
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "mt-2 font-display text-3xl font-semibold tracking-tight",
                      isAdmin && !authLoading ? "text-emerald-600" : "text-slate-950",
                    )}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{stat.detail}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-glow">
                  <Icon className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Card className="overflow-hidden border-white/70 bg-white/85 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-glow">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-display text-[1.65rem] leading-tight text-slate-950">
                  Welcome back to Vaporcast
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-6 text-slate-600">
                  Plan your next launch, monitor queue health, and move from concept to export
                  faster.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Quick action: create a product launch teaser",
              "AI tip: use 9:16 for social-first campaigns",
              "Recent render: Founder Story, complete in 1m 48s",
              "Notification: 4 queued renders have started",
              "Account: Pro plan, team seats 3/5",
              "Pipeline: no failed jobs in the last 24h",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Card className="border-white/70 bg-white/85 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl text-slate-950">Render queue</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                Live status updates for the most recent jobs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Holiday promotion</span>
                  <span className="text-sky-600">62%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-slate-950 to-sky-500" />
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Founder update</span>
                  <span className="text-emerald-600">Ready</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">Export available in videos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/85 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl text-slate-950">Tips and alerts</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                Keep quality high and iteration cycles short.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <Lightbulb className="mt-0.5 h-4 w-4 text-amber-500" />
                Test two opening hooks and compare completion rates.
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <Bell className="mt-0.5 h-4 w-4 text-sky-600" />3 team notifications need review.
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <Sparkles className="mt-0.5 h-4 w-4 text-violet-600" />
                New AI prompt enhancer now available in create flow.
              </div>
              <button className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-slate-700">
                Open activity stream
                <ArrowRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-white/70 bg-white/85 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl text-slate-950">Recent activity</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              Your latest workflow events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Video export downloaded by marketing-team@vaporcast.io",
              'Template "Product Launch" duplicated',
              'Avatar selection updated to "Mina"',
            ].map((event) => (
              <div
                key={event}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {event}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/85 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl text-slate-950">Account overview</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              Plan, credits, and billing posture at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Plan</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Creator Pro</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Seats</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">3 / 5 active</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Credits</p>
              <p
                className={cn(
                  "mt-1 text-lg font-semibold",
                  isAdmin && !authLoading ? "text-emerald-600" : "text-slate-900",
                )}
              >
                {creditValue}
              </p>
              <p className="text-xs text-slate-500">{creditDetail}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Renewal</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">July 22</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
