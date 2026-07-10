import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { listLeads, type Lead } from "@/lib/leads-store.server";

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
  source: z.string().optional(),
  since: z.string().optional(),
  limit: z.number().int().min(1).max(5000).optional(),
});

export const listLeadsFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data: unknown) => filtersSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<{ leads: Lead[] }> => {
    const leads = await listLeads(data);
    return { leads };
  });

export const checkIsAdminFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: !!data };
  });
