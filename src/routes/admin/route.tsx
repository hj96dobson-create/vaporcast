import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase, supabaseClientReady } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (!supabaseClientReady) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.href },
      });
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.href },
      });
    }

    const { data: roleRows, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error || !roleRows) {
      throw redirect({ to: "/dashboard" });
    }

    return { user: data.session.user };
  },
  component: () => <Outlet />,
});
