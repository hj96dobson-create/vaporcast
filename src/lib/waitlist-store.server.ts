import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type WaitlistRow = {
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

const SELECT_COLS =
  "id, email, source, status, is_founding_vip, discount_tier, rejection_reason, confirmed_at, created_at";

export async function getConfirmedCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("waitlist")
    .select("id", { count: "exact", head: true })
    .eq("status", "confirmed");
  if (error) throw error;
  return count ?? 0;
}

export async function findByEmail(emailNormalized: string) {
  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .select(`${SELECT_COLS}, confirmation_token`)
    .eq("email_normalized", emailNormalized)
    .maybeSingle();
  if (error) throw error;
  return data as (WaitlistRow & { confirmation_token: string | null }) | null;
}

export async function insertPending(input: {
  email: string;
  emailNormalized: string;
  source: string;
  token: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .insert({
      email: input.email,
      email_normalized: input.emailNormalized,
      source: input.source,
      status: "pending",
      confirmation_token: input.token,
    })
    .select(SELECT_COLS)
    .single();
  if (error) throw error;
  return data as WaitlistRow;
}

export async function confirmByToken(token: string) {
  const { data, error } = await supabaseAdmin.rpc("confirm_waitlist", {
    _token: token,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return (row ?? null) as
    | {
        id: string;
        email: string;
        status: "pending" | "confirmed" | "rejected";
        is_founding_vip: boolean;
        discount_tier: "vip" | "standard";
      }
    | null;
}

export async function listWaitlist(filters: {
  q?: string;
  status?: string;
  tier?: string;
  limit?: number;
}): Promise<WaitlistRow[]> {
  const limit = Math.min(Math.max(filters.limit ?? 500, 1), 5000);
  let query = supabaseAdmin
    .from("waitlist")
    .select(SELECT_COLS)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (filters.q?.trim()) query = query.ilike("email", `%${filters.q.trim()}%`);
  if (filters.status && filters.status !== "all")
    query = query.eq("status", filters.status);
  if (filters.tier && filters.tier !== "all")
    query = query.eq("discount_tier", filters.tier);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as WaitlistRow[];
}

export async function getWaitlistStats() {
  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .select("status, discount_tier, is_founding_vip");
  if (error) throw error;
  const rows = (data ?? []) as {
    status: string;
    discount_tier: string;
    is_founding_vip: boolean;
  }[];
  const stats = {
    total: rows.length,
    confirmed: 0,
    pending: 0,
    rejected: 0,
    vip: 0,
    standard: 0,
  };
  for (const r of rows) {
    if (r.status === "confirmed") stats.confirmed++;
    else if (r.status === "pending") stats.pending++;
    else if (r.status === "rejected") stats.rejected++;
    if (r.is_founding_vip) stats.vip++;
    else if (r.status === "confirmed") stats.standard++;
  }
  return stats;
}
