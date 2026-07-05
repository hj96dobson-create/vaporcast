import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Crown, Ban } from "lucide-react";
import { checkIsAdminFn } from "@/lib/leads.functions";
import { getWaitlistStatsFn, listWaitlistFn } from "@/lib/waitlist.functions";

type Row = {
  id: string;
  email: string;
  source: string;
  status: "pending" | "confirmed" | "rejected";
  is_founding_vip: boolean;
  discount_tier: "vip" | "standard";
  rejection_reason: string | null;
  confirmed_at: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/waitlist")({
  head: () => ({
    meta: [
      { title: "Waitlist Management — Vaporcast" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: WaitlistAdmin,
});

function WaitlistAdmin() {
  const navigate = useNavigate();
  const checkIsAdmin = useServerFn(checkIsAdminFn);
  const listWaitlist = useServerFn(listWaitlistFn);
  const getStats = useServerFn(getWaitlistStatsFn);

  const [authorized, setAuthorized] = useState<null | boolean>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    confirmed: number;
    pending: number;
    rejected: number;
    vip: number;
    standard: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  useEffect(() => {
    checkIsAdmin()
      .then(({ isAdmin }) => {
        if (isAdmin) setAuthorized(true);
        else navigate({ to: "/", replace: true });
      })
      .catch(() => navigate({ to: "/", replace: true }));
  }, [checkIsAdmin, navigate]);

  const filters = useMemo(
    () => ({
      q: q.trim() || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      tier: tierFilter !== "all" ? tierFilter : undefined,
    }),
    [q, statusFilter, tierFilter],
  );

  const load = useCallback(() => {
    if (authorized !== true) return;
    setLoading(true);
    setError(null);
    Promise.all([listWaitlist({ data: filters }), getStats()])
      .then(([list, s]) => {
        setRows((list.rows ?? []) as Row[]);
        setStats(s);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, [authorized, filters, listWaitlist, getStats]);

  useEffect(() => {
    load();
  }, [load]);

  if (authorized !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Waitlist Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Confirmed users become VIPs for the first 10 spots, then standard.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/admin/leads"
              className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-accent"
            >
              Leads
            </Link>
            <button
              onClick={load}
              className="inline-flex items-center rounded-md border border-border bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              Refresh
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total", value: stats?.total ?? "—" },
            { label: "Confirmed", value: stats?.confirmed ?? "—" },
            { label: "Pending", value: stats?.pending ?? "—" },
            { label: "VIP", value: stats?.vip ?? "—" },
            { label: "Rejected", value: stats?.rejected ?? "—" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 text-2xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Search email</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="name@example.com"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Tier</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
            className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm"
          >
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
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
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
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
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
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
                      <td className="px-4 py-3 capitalize">{r.discount_tier}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.rejection_reason ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
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
