import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.href },
      });
    }

    // TODO: Add role check for admin access
    // const { data: profile } = await supabase
    //   .from('profiles')
    //   .select('role')
    //   .eq('id', data.session.user.id)
    //   .single();
    //
    // if (profile?.role !== 'admin') {
    //   throw redirect({ to: '/dashboard' });
    // }

    return { user: data.session.user };
  },
  component: () => <Outlet />,
});
