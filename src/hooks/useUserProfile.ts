import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

type UserProfile = {
  username: string;
};

export function useUserProfile() {
  const { user, loading: userLoading } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .single();

    setProfile(data ?? null);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (userLoading) {
      return;
    }
    void loadProfile();
  }, [userLoading, loadProfile]);

  return {
    profile,
    loading: userLoading || loading,
    refresh: loadProfile,
  };
}
