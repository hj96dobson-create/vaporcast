import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { listWaitlist, getWaitlistStats, type WaitlistRow } from "@/lib/waitlist-store.server";

const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error("Failed to verify admin role");
    if (!data) throw new Error("Forbidden: admin role required");
    return next();
  });

const filtersSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  tier: z.string().optional(),
  limit: z.number().int().min(1).max(5000).optional(),
});

export const listWaitlistFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => filtersSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<{ rows: WaitlistRow[] }> => {
    const rows = await listWaitlist(data);
    return { rows };
  });

export const getWaitlistStatsFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const stats = await getWaitlistStats();
    return stats;
  });
