import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuthUser() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncAuthState = async (nextSession: Session | null) => {
      if (!mounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user?.id) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.rpc("has_role", {
        _user_id: nextSession.user.id,
        _role: "admin",
      });

      if (!mounted) return;

      if (error) {
        console.error("Failed to evaluate admin role", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(data));
      }

      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      void syncAuthState(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncAuthState(nextSession);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, session, isAdmin, loading };
}
