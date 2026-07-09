import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { useUserProfile } from "@/hooks/useUserProfile";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useSession();
  const { profile, loading: profileLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.navigate({ to: "/auth" });
      return;
    }

    if (!loading && user && !profileLoading && !profile) {
      router.navigate({ to: "/profile" });
    }
  }, [loading, profileLoading, profile, router, user]);

  if (loading) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Loading dashboard</h1>
          <p className="mt-2 text-slate-600">
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
    <div className="p-10 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-600">
              Use the dashboard tools to manage your workspace.
            </p>
          </div>

          <button
            onClick={() => router.navigate({ to: "/dashboard/create" })}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create video
          </button>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
