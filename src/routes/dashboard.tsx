import { createFileRoute, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useSession } from "@/hooks/useSession";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { RoadmapPanel } from "@/components/dashboard/RoadmapPanel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useSession();
  const { isAdmin } = useAuthUser();
  const router = useRouter();
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";

  useEffect(() => {
    if (!loading && !user) {
      router.navigate({ to: "/auth" });
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <h1 className="text-2xl font-semibold text-slate-950">Loading dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Verifying your session before showing dashboard content.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardShell>
      <div className="space-y-6 lg:space-y-8">
        {isDashboardHome && (
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9)_45%,rgba(14,165,233,0.28))] p-5 text-white shadow-[0_24px_100px_-48px_rgba(15,23,42,0.95)] backdrop-blur sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
              <div className="space-y-4 sm:space-y-5">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                  AI powered studio
                </div>
                {isAdmin && (
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Admin session verified
                  </div>
                )}
                <h1 className="max-w-3xl font-display text-[2.2rem] font-semibold leading-tight tracking-tight sm:text-[2.75rem] md:text-5xl xl:text-6xl">
                  Build polished videos with one prompt.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/75 sm:text-base md:text-lg">
                  Choose an avatar, shape the script, and launch a premium video workflow without
                  leaving your dashboard.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    onClick={() => router.navigate({ to: "/dashboard/create" })}
                    className="w-full rounded-full bg-white px-6 text-slate-950 shadow-lg shadow-cyan-500/10 hover:bg-cyan-50 sm:w-auto"
                  >
                    Create video
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.navigate({ to: "/dashboard/avatars" })}
                    className="w-full rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    Browse avatars
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:p-5">
                <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                    Now processing
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
                      <span className="font-medium">Prompt parsing</span>
                      <span className="text-cyan-300">Done</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
                      <span className="font-medium">Avatar render</span>
                      <span className="text-amber-300">Running</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isDashboardHome ? (
          <>
            <DashboardCards />

            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_80px_-42px_rgba(15,23,42,0.4)] backdrop-blur sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-[1.65rem] font-semibold tracking-tight text-slate-950 sm:text-2xl">
                    Workspace
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">
                    Everything you need for generation, preview, and delivery.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.navigate({ to: "/dashboard/create" })}
                  className="w-full rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50 sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  Start creating
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_80px_-42px_rgba(15,23,42,0.4)] backdrop-blur sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-[1.65rem] font-semibold tracking-tight text-slate-950 sm:text-2xl">
                    Feature roadmap
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">
                    Priorities shaped by leading AI video platforms and Vaporcast's current stack.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.navigate({ to: "/dashboard/roadmap" })}
                  className="w-full rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50 sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  Open roadmap
                </Button>
              </div>

              <div className="mt-6">
                <RoadmapPanel />
              </div>
            </div>
          </>
        ) : null}

        <Outlet />
      </div>
    </DashboardShell>
  );
}
