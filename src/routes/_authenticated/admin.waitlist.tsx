import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, Crown } from "lucide-react";
import { getWaitlistStatsFn, listWaitlistFn } from "@/lib/waitlist.functions";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/layout/AppShell";

type Row = {
  id: string;
  email: string;
  source: string;
  status: "pending" | "confirmed" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  discount_tier: string;
  is_founding_vip: boolean;
};

type Stats = {
  total: number;
  confirmed: number;
  pending: number;
  rejected: number;
  vip: number;
} | null;

export const Route = createFileRoute("/_authenticated/admin/waitlist")({
  head: () => ({
    meta: [
      { title: "Waitlist Management — Vaporcast" },
      { name: "description", content: "Review, export, and manage waitlist submissions." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: WaitlistAdmin,
});

function toCsv(rows: Row[]) {
  const header = ["id", "email", "source", "status", "tier", "reason", "created_at", "vip"];
  const escape = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.email,
        r.source,
        r.status,
        r.discount_tier,
        r.rejection_reason ?? "",
        r.created_at,
        String(r.is_founding_vip),
      ]
        .map(escape)
        .join(","),
    );
  }
  return lines.join("\n");
}

function WaitlistAdmin() {
  const navigate = useNavigate();
  const listWaitlist = useServerFn(listWaitlistFn);
  const getStats = useServerFn(getWaitlistStatsFn);
  const { isAdmin, loading: authLoading } = useAuthUser();

  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<Stats>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  const canRenderProtectedContent = !authLoading && isAdmin;

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate({ to: "/", replace: true });
    }
  }, [authLoading, isAdmin, navigate]);

  const filters = useMemo(
    () => ({
      q: q.trim() || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      tier: tierFilter !== "all" ? tierFilter : undefined,
    }),
    [q, statusFilter, tierFilter],
  );

  const load = useCallback(() => {
    if (!isAdmin || authLoading) return;
    setLoading(true);
    setError(null);
    Promise.all([listWaitlist({ data: filters }), getStats()])
      .then(([list, s]) => {
        setRows((list.rows ?? []) as Row[]);
        setStats(s);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [authLoading, isAdmin, filters, listWaitlist, getStats]);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = useCallback(async () => {
    try {
      const res = await listWaitlist({ data: { ...filters, limit: 5000 } });
      const blob = new Blob([toCsv((res.rows ?? []) as Row[])], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    }
  }, [filters, listWaitlist]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }, [navigate]);

  if (!canRenderProtectedContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <AppShell
      heading="Waitlist operations"
      subheading="Review submissions, prioritize tiers, and manage launch cohorts."
    >
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-6 lg:py-10">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Waitlist Management
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Confirmed users become VIPs for the first 10 spots, then standard.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/admin/leads"
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-accent"
              >
                Leads
              </Link>
              <button
                onClick={load}
                className="inline-flex items-center rounded-full border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Export CSV
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Sign out
              </button>
            </div>
          </header>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: "Total", value: stats?.total ?? "—" },
              { label: "Confirmed", value: stats?.confirmed ?? "—" },
              { label: "Pending", value: stats?.pending ?? "—" },
              { label: "VIP", value: stats?.vip ?? "—" },
              { label: "Rejected", value: stats?.rejected ?? "—" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-1 text-2xl font-semibold text-slate-950">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600">Search email</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="name@example.com"
                className="rounded-2xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600">Tier</span>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="rounded-2xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All tiers</option>
                <option value="vip">VIP</option>
                <option value="standard">Standard</option>
              </select>
            </label>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive"
            >
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="min-w-[48rem] w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-[0.16em] text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Tier</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No waitlist entries match your filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const rowClass = r.is_founding_vip
                      ? "border-t border-border/60 bg-yellow-50/60"
                      : r.status === "rejected"
                        ? "border-t border-border/60 bg-destructive/5 text-muted-foreground"
                        : "border-t border-border/60";
                    return (
                      <tr key={r.id} className={rowClass}>
                        <td className="px-4 py-3 font-medium text-slate-950">
                          <div className="flex flex-wrap items-center gap-2">
                            {r.email}
                            {r.is_founding_vip && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 px-2 py-0.5 text-[10px] font-semibold text-yellow-900">
                                <Crown className="h-3 w-3" /> VIP MEMBER
                              </span>
                            )}
                            {r.status === "rejected" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                                <Ban className="h-3 w-3" /> BLOCKED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill status={r.status} />
                        </td>
                        <td className="px-4 py-3 capitalize text-slate-700">{r.discount_tier}</td>
                        <td className="px-4 py-3 text-slate-600">{r.rejection_reason ?? "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-destructive/10 text-destructive",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}
