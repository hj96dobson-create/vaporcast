import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type Lead = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

function toLead(row: {
  id: string;
  email: string;
  source: string;
  created_at: string;
}): Lead {
  return {
    id: row.id,
    email: row.email,
    source: row.source,
    createdAt: row.created_at,
  };
}

export async function addLead(input: {
  email: string;
  source?: string;
}): Promise<Lead> {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert({ email: input.email, source: input.source ?? "cta" })
    .select("id, email, source, created_at")
    .single();
  if (error) throw error;
  return toLead(data);
}

export async function listLeads(filters: {
  q?: string;
  source?: string;
  since?: string;
  limit?: number;
}): Promise<Lead[]> {
  const limit = Math.min(Math.max(filters.limit ?? 500, 1), 5000);
  let query = supabaseAdmin
    .from("leads")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.q?.trim()) {
    query = query.ilike("email", `%${filters.q.trim()}%`);
  }
  if (filters.source && filters.source.toLowerCase() !== "all") {
    query = query.eq("source", filters.source);
  }
  if (filters.since) {
    const sinceIso = new Date(filters.since).toISOString();
    if (!Number.isNaN(Date.parse(sinceIso))) {
      query = query.gte("created_at", sinceIso);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toLead);
}
