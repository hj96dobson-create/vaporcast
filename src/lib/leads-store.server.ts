export type Lead = {
  id: string;
  email: string;
  source: string;
  createdAt: string; // ISO
};

// In-memory store. Works per worker instance; swap for a DB when ready.
const g = globalThis as unknown as { __leads?: Lead[] };
if (!g.__leads) g.__leads = [];

export function addLead(input: { email: string; source?: string }): Lead {
  const lead: Lead = {
    id:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    email: input.email,
    source: input.source ?? "cta",
    createdAt: new Date().toISOString(),
  };
  g.__leads!.unshift(lead);
  // Cap memory
  if (g.__leads!.length > 5000) g.__leads!.length = 5000;
  return lead;
}

export function listLeads(filters: {
  q?: string;
  source?: string;
  since?: string; // ISO date
  limit?: number;
}): Lead[] {
  const q = filters.q?.trim().toLowerCase();
  const source = filters.source?.trim().toLowerCase();
  const sinceMs = filters.since ? Date.parse(filters.since) : NaN;
  const limit = Math.min(Math.max(filters.limit ?? 500, 1), 5000);

  return g.__leads!
    .filter((l) => {
      if (q && !l.email.toLowerCase().includes(q)) return false;
      if (source && source !== "all" && l.source.toLowerCase() !== source)
        return false;
      if (!Number.isNaN(sinceMs) && Date.parse(l.createdAt) < sinceMs)
        return false;
      return true;
    })
    .slice(0, limit);
}

export function distinctSources(): string[] {
  return Array.from(new Set(g.__leads!.map((l) => l.source))).sort();
}
