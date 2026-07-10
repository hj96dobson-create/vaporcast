import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, UserRound, Wand2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const RESERVED_USERNAMES = ["admin", "root", "support", "help", "superuser"];

function generateRandomUsername() {
  const adjectives = [
    "bright",
    "swift",
    "clever",
    "bold",
    "spark",
    "nova",
    "pixel",
    "studio",
    "video",
    "vapor",
    "frame",
    "mellow",
    "vibe",
    "blend",
  ];

  const nouns = [
    "creator",
    "maker",
    "artist",
    "pilot",
    "spark",
    "motion",
    "flux",
    "studio",
    "echo",
    "pulse",
    "glow",
    "beat",
    "fusion",
    "scope",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.random() < 0.5 ? "" : String(Math.floor(Math.random() * 90) + 10);

  return `${adjective}_${noun}${number}`;
}

function validateUsername(value: string) {
  const normalized = value.trim().toLowerCase();
  const formatValid = /^[a-z0-9_]{3,20}$/.test(normalized);
  const reserved = RESERVED_USERNAMES.includes(normalized);

  return {
    normalized,
    valid: formatValid && !reserved,
    message: reserved
      ? "This username is reserved."
      : formatValid
        ? ""
        : "Username must be 3–20 chars and contain only letters, numbers, or underscore.",
  };
}

function ProfilePage() {
  const { user, loading: userLoading } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "saving" | "success" | "error">(
    "idle",
  );

  const [error, setError] = useState<string | null>(null);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);

  const validation = useMemo(() => validateUsername(username), [username]);

  const canSubmit = validation.valid && status !== "saving";

  useEffect(() => {
    if (!user && !userLoading) {
      router.navigate({ to: "/auth" });
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user) return;

    void (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .single();

      setProfileUsername(data?.username ?? null);
    })();
  }, [user]);

  async function checkAvailability() {
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !validation.valid) {
      setError(validation.message || "Enter a valid username before saving.");
      return;
    }

    setError(null);
    setStatus("saving");

    const normalized = validation.normalized;

    await checkAvailability();

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        username: normalized,
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      console.error("[profile] save error", error);
      setError(error.message || "Unable to save username. Please try again.");
      setStatus("error");
      return;
    }

    setProfileUsername(normalized);
    setStatus("success");
  }

  function handleGenerate() {
    const next = generateRandomUsername();

    setUsername(next);
    setError(null);
    setStatus("idle");
  }

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-muted-foreground">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm leading-6 text-slate-600 shadow-sm">
          Loading your profile…
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      heading="Account workspace"
      subheading="Manage profile identity, settings, and workspace preferences."
    >
      <div className="min-h-screen px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
            <CardHeader>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
                <UserRound className="h-3.5 w-3.5 text-cyan-300" />
                Account hub
              </div>
              <CardTitle className="font-display text-3xl text-white">Profile</CardTitle>
              <CardDescription className="text-white/70">
                Manage your username and account details. Email is used only for login and recovery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.4rem] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Email</p>
                <p className="mt-2 text-base font-medium text-white">{user.email}</p>
              </div>
              <div className="rounded-[1.4rem] bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Username</p>
                <p className="mt-2 text-base font-medium text-white">
                  {profileUsername ?? "Not set yet"}
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-white/5 p-4 text-sm text-white/70">
                Your profile is designed to plug into future preference and brand controls without
                changing auth.
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white shadow-glow">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                  Username builder
                </div>
                <CardTitle className="font-display text-[1.65rem] text-slate-950">
                  Claim your identity
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
                  Generate a username or choose one manually. This is the name that appears in your
                  workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-800">
                      Set username
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your_username"
                        className="h-12 rounded-2xl border-slate-200 bg-white"
                      />
                      <Button
                        type="button"
                        onClick={handleGenerate}
                        className="rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
                      >
                        Generate
                      </Button>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      Username must be 3–20 characters, lowercase letters, numbers, or underscore.
                    </p>
                    {error && <p className="text-sm leading-6 text-rose-700">{error}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      className="rounded-2xl bg-slate-950 px-6 text-white hover:bg-slate-800"
                    >
                      {status === "saving" ? "Saving…" : "Save username"}
                    </Button>
                    {status === "success" && (
                      <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-white">
                        Username saved successfully.
                      </Badge>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6 border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-xl text-slate-950">Next up</CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Keep moving through the studio without leaving the workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span>Edit avatar preferences</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span>Start a new render</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
