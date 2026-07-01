import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads Admin — Vaporcast" },
      { name: "description", content: "Recent lead submissions with filters and CSV export." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LeadsAdmin,
});

function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [source, setSource] = useState("all");
  const [since, setSince] = useState("");

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (source && source !== "all") p.set("source", source);
    if (since) p.set("since", new Date(since).toISOString());
    return p.toString();
  }, [q, source, since]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/leads?${query}`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed (${r.status})`);
        return r.json();
      })
      .then((data: { leads: Lead[] }) => setLeads(data.leads ?? []))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message ?? "Failed to load");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query]);

  const sources = useMemo(
    () => Array.from(new Set(leads.map((l) => l.source))).sort(),
    [leads],
  );

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
          <a
            href={`/api/leads?${query}${query ? "&" : ""}format=csv`}
            className="inline-flex items-center rounded-md border border-border bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            Export CSV
          </a>
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
          Leads are stored in the running server instance. Connect a database for persistence across deploys.
        </p>
      </div>
    </div>
  );
}
