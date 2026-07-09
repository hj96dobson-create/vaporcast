import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

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
  const canSubmit =
    validation.valid && status !== "saving" && status !== "checking";

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

  async function checkAvailability(value: string) {
    if (profileUsername === value) {
      return true;
    }

    setStatus("checking");
    setError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("username", value)
      .neq("user_id", user!.id)
      .maybeSingle();

    if (error) {
      console.error("[profile] username check error", error);
      setError("Unable to verify username availability. Please try again.");
      setStatus("error");
      return false;
    }

    if (data) {
      setError("Username is already taken.");
      setStatus("error");
      return false;
    }

    setStatus("idle");
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !validation.valid) return;

    setError(null);
    setStatus("saving");

    const normalized = validation.normalized;
    const available = await checkAvailability(normalized);
    if (!available) {
      setStatus("error");
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        username: normalized,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      setError("Unable to save username. Please try again.");
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
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-card p-8 shadow-soft">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your username and account details. Email is used only for login and recovery.
        </p>

        <div className="mt-8 grid gap-6 rounded-3xl border border-border bg-secondary/30 p-6">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1 font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="mt-1 font-medium">{profileUsername ?? "Not set yet"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground">Set username</label>
            <div className="mt-2 flex gap-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="flex-1 rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center justify-center rounded-3xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Generate
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Username must be 3–20 characters, lowercase letters, numbers, or underscore.
            </p>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "saving" || status === "checking" ? "Checking availability…" : "Save username"}
          </button>
          {status === "success" && (
            <p className="text-sm text-cyan">Username saved successfully.</p>
          )}
        </form>
      </div>
    </div>
  );
}
