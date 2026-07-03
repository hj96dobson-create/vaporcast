import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Use getSession() — it awaits Supabase's async storage hydration and
    // resolves from localStorage without a network round-trip. getUser()
    // hits the network and can race/flake right after signInWithPassword,
    // producing a false "no user" and bouncing back to /auth.
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.href },
      });
    }
    return { user: data.session.user };
  },
  component: () => <Outlet />,
});

