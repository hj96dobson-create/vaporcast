import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdminFn, listLeadsFn } from "@/lib/leads.functions";

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
  const escape = (v: string) =>
    /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([r.id, r.email, r.source, r.createdAt].map(escape).join(","));
  }
  return lines.join("\n");
}

function LeadsAdmin() {
  const navigate = useNavigate();
  const listLeads = useServerFn(listLeadsFn);
  const checkIsAdmin = useServerFn(checkIsAdminFn);

  const [authorized, setAuthorized] = useState<null | boolean>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [source, setSource] = useState("all");
  const [since, setSince] = useState("");

  useEffect(() => {
    checkIsAdmin()
      .then(({ isAdmin }) => {
        if (isAdmin) {
          setAuthorized(true);
        } else {
          navigate({ to: "/", replace: true });
        }
      })
      .catch(() => navigate({ to: "/", replace: true }));
  }, [checkIsAdmin, navigate]);


  const filters = useMemo(
    () => ({
      q: q.trim() || undefined,
      source: source !== "all" ? source : undefined,
      since: since ? new Date(since).toISOString() : undefined,
    }),
    [q, source, since],
  );

  useEffect(() => {
    if (authorized !== true) return;
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
  }, [authorized, filters, listLeads]);

  const sources = useMemo(
    () => Array.from(new Set(leads.map((l) => l.source))).sort(),
    [leads],
  );

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

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is signed in but does not have the admin role. Ask an
            existing admin to grant you access.
          </p>
          <button
            onClick={handleSignOut}
            className="mt-6 inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Leads</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? "Loading…" : `${leads.length} result${leads.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center rounded-md border border-border bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
            >
              Export CSV
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition"
            >
              Sign out
            </button>
          </div>
        </header>

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
            <span className="text-muted-foreground">Source</span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
            <span className="text-muted-foreground">Since</span>
            <input
              type="date"
              value={since}
              onChange={(e) => setSince(e.target.value)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        {error && (
          <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && !loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                    No leads match your filters.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} className="border-t border-border/60">
                    <td className="px-4 py-3 font-medium">{l.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                        {l.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Restricted to accounts with the admin role. Grant access by inserting
          a row into <code>user_roles</code> with role <code>admin</code>.
        </p>
      </div>
    </div>
  );
}
