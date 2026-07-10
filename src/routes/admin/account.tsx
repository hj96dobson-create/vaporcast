import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, Shield, UserRound, Mail, Fingerprint, LogOut, Check } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/hooks/useSession";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/account")({
  component: AdminAccountPage,
});

function AdminAccountPage() {
  const { user, loading } = useSession();
  const { profile, loading: profileLoading } = useUserProfile();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const provider = useMemo(() => {
    const metaProvider = user?.app_metadata?.provider;
    return typeof metaProvider === "string" && metaProvider.length > 0 ? metaProvider : "email";
  }, [user?.app_metadata?.provider]);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Badge className="rounded-full bg-slate-950 px-3 py-1 text-white hover:bg-slate-950">
            Private admin profile
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">My account</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            This page shows the login identity attached to your current Supabase session. It does
            not expose passwords or tokens.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/70 bg-white/90 shadow-[0_20px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur">
            <CardHeader>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white shadow-glow">
                <Shield className="h-3.5 w-3.5 text-cyan-300" />
                Auth details
              </div>
              <CardTitle className="font-display text-2xl text-slate-950">
                Your login details
              </CardTitle>
              <CardDescription>Verified from the active session in this browser.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading || profileLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Loading account information…
                </div>
              ) : (
                <>
                  <DetailRow
                    icon={Mail}
                    label="Email address"
                    value={user?.email ?? "No email on this session"}
                    onCopy={() => user?.email && handleCopy(user.email, "email")}
                    copied={copiedField === "email"}
                  />
                  <DetailRow
                    icon={Fingerprint}
                    label="User ID"
                    value={user?.id ?? "No session user id"}
                    onCopy={() => user?.id && handleCopy(user.id, "user-id")}
                    copied={copiedField === "user-id"}
                  />
                  <DetailRow
                    icon={UserRound}
                    label="Username"
                    value={profile?.username ?? "Not set yet"}
                    onCopy={() => profile?.username && handleCopy(profile.username, "username")}
                    copied={copiedField === "username"}
                  />
                  <DetailRow icon={Shield} label="Auth provider" value={provider} />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_20px_80px_-44px_rgba(15,23,42,0.6)]">
            <CardHeader>
              <CardTitle className="font-display text-2xl text-white">Account actions</CardTitle>
              <CardDescription className="text-white/70">
                Keep this page open for quick access to your admin identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-[1.4rem] bg-white/5 p-4 text-sm text-white/75">
                You are signed in as the current browser session. If you need a different admin
                account, sign out and log in again.
              </div>
              <Button
                type="button"
                onClick={handleSignOut}
                className="w-full rounded-2xl bg-white px-4 py-3 text-slate-950 hover:bg-cyan-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
              <div className="rounded-[1.4rem] bg-white/5 p-4 text-sm text-white/70">
                Passwords are never shown here. Only the login identity already established by
                Supabase is displayed.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  onCopy,
  copied,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-1 break-all text-sm font-medium text-slate-950">{value}</p>
        </div>
      </div>
      {onCopy && (
        <Button
          type="button"
          onClick={onCopy}
          variant="outline"
          className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      )}
    </div>
  );
}
