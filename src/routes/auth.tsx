import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";


const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Sign in — Vaporcast" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

const DEFAULT_DEST = "/dashboard";
const REDIRECT_KEY = "postAuthRedirect";

function safeRedirect(target: string | undefined | null): string | null {
  if (!target) return null;
  if (target.startsWith("/") && !target.startsWith("//") && !target.startsWith("/auth")) {
    return target;
  }
  return null;
}

function readStoredRedirect(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(REDIRECT_KEY);
  } catch {
    return null;
  }
}

function clearStoredRedirect() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(REDIRECT_KEY);
  } catch {
    // ignore
  }
}

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { redirect } = Route.useSearch();

  const resolveDest = () =>
    safeRedirect(redirect) ?? safeRedirect(readStoredRedirect()) ?? DEFAULT_DEST;

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    // Persist an explicit ?redirect= so OAuth round-trips (which drop search
    // params when the provider returns to window.location.origin) can still
    // restore the originally requested destination.
    const safe = safeRedirect(redirect);
    if (safe && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(REDIRECT_KEY, safe);
      } catch {
        // ignore
      }
    }
    // Wait for Supabase to hydrate its session from storage before deciding
    // whether to bounce an already-signed-in user to their destination.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const dest = resolveDest();
        clearStoredRedirect();
        navigate({ to: dest, replace: true });
      } else {
        setCheckingSession(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect, navigate]);


  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Invalidate the router so _authenticated beforeLoad re-runs with the
        // fresh session; without this the guard can still see the pre-login
        // state and bounce us back to /auth.
        await router.invalidate();
        const dest = resolveDest();
        clearStoredRedirect();
        navigate({ to: dest, replace: true });

      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setNotice("Account created. Check your inbox to confirm your email, then sign in.");
        setMode("sign-in");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(result.error.message ?? "Google sign-in failed");
      if (result.redirected) return;
      await router.invalidate();
      const dest = resolveDest();
      clearStoredRedirect();
      navigate({ to: dest, replace: true });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">

      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "sign-in"
            ? "Access the Vaporcast admin dashboard."
            : "Sign up, then request admin access."}
        </p>

        <button
          type="button"
          onClick={onGoogle}
          disabled={loading}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-60 transition"
        >
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.3-.4-3.5z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Password</span>
            <input
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          {error && (
            <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-3 py-2 text-sm">
              {error}
            </div>
          )}
          {notice && (
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              {notice}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
          >
            {loading ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setNotice(null);
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
          }}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "sign-in"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
