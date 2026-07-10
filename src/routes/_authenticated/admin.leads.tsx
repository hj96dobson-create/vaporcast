import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listLeadsFn } from "@/lib/leads.functions";
import { useAuthUser } from "@/hooks/useAuthUser";
import { AppShell } from "@/components/layout/AppShell";

type Lead = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

export const Route = createFileRoute("/_authenticated/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads Admin — Vaporcast" },
      { name: "description", content: "Recent lead submissions with filters and CSV export." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LeadsAdmin,
});

function toCsv(rows: Lead[]) {
  const header = ["id", "email", "source", "createdAt"];
  const escape = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([r.id, r.email, r.source, r.createdAt].map(escape).join(","));
  }
  return lines.join("\n");
}

function LeadsAdmin() {
  const navigate = useNavigate();
  const listLeads = useServerFn(listLeadsFn);
  const { isAdmin, loading: authLoading } = useAuthUser();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [source, setSource] = useState("all");
  const [since, setSince] = useState("");

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
      source: source !== "all" ? source : undefined,
      since: since ? new Date(since).toISOString() : undefined,
    }),
    [q, source, since],
  );

  useEffect(() => {
    if (!isAdmin || authLoading) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    listLeads({ data: filters })
      .then((res) => {
        if (!cancelled) setLeads(res.leads ?? []);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAdmin, filters, listLeads]);

  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source))).sort(), [leads]);

  const handleExport = useCallback(async () => {
    try {
      const res = await listLeads({ data: { ...filters, limit: 5000 } });
      const blob = new Blob([toCsv(res.leads ?? [])], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    }
  }, [filters, listLeads]);

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
      heading="Leads intelligence"
      subheading="Monitor acquisition quality, attribution, and lead funnel health."
    >
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-6 lg:py-10">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Leads
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {loading ? "Loading…" : `${leads.length} result${leads.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center rounded-full border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Export CSV
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent"
              >
                Sign out
              </button>
            </div>
          </header>

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
              <span className="text-slate-600">Source</span>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="rounded-2xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All sources</option>
                {["cta", ...sources.filter((s) => s !== "cta")].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600">Since</span>
              <input
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
                className="rounded-2xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
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
            <table className="min-w-[44rem] w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-[0.16em] text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                      No leads match your filters.
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr key={l.id} className="border-t border-border/60">
                      <td className="px-4 py-3 font-medium text-slate-950 break-all">{l.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-slate-700">
                          {l.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {new Date(l.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Restricted to accounts with the admin role. Grant access by inserting a row into{" "}
            <code>user_roles</code> with role <code>admin</code>.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
