import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase, supabaseClientReady } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (!supabaseClientReady) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.href },
      });
    }

    // Use getSession() — it awaits Supabase's async storage hydration and
    // resolves from localStorage without a network round-trip. getUser()
    // hits the network and can race/flake right after signInWithPassword,
    // producing a false "no user" and bouncing back to /auth.
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      // Stash the intended destination so OAuth flows (which lose search
      // params on the round-trip through the provider) can still restore it.
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("postAuthRedirect", location.href);
        } catch {
          // sessionStorage may be unavailable (private mode); ignore.
        }
      }
      throw redirect({
        to: "/auth",
        search: { redirect: location.href },
      });
    }

    return { user: data.session.user };
  },
  component: () => <Outlet />,
});
