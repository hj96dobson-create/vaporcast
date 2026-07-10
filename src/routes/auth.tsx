import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import {
  supabase,
  supabaseClientMissingEnv,
  supabaseClientReady,
} from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { ArrowRight, Bot, Sparkles, Wand2 } from "lucide-react";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Sign in — Vaporcast" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AuthPage,
});

const DEFAULT_DEST = "/";
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

  const envErrorMessage = `Authentication is unavailable. Missing client environment variable(s): ${supabaseClientMissingEnv.join(", ")}.`;

  useEffect(() => {
    if (!supabaseClientReady) {
      setCheckingSession(false);
      setError(envErrorMessage);
      return;
    }

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
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const userId = data.session.user.id;
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", userId)
          .single();

        if (!profileData?.username) {
          clearStoredRedirect();
          navigate({ to: "/profile", replace: true });
          return;
        }

        const dest = resolveDest();
        clearStoredRedirect();
        navigate({ to: dest, replace: true });
      } else {
        setCheckingSession(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect, navigate, envErrorMessage]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (!supabaseClientReady) {
        throw new Error(envErrorMessage);
      }

      if (mode === "sign-in") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await router.invalidate();

        const userId = data?.user?.id;
        if (userId) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username")
            .eq("user_id", userId)
            .single();

          if (!profileData?.username) {
            clearStoredRedirect();
            navigate({ to: "/profile", replace: true });
            return;
          }
        }

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
      if (!supabaseClientReady) {
        throw new Error(envErrorMessage);
      }

      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(result.error.message ?? "Google sign-in failed");
      if (result.redirected) return;
      await router.invalidate();

      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      if (userId) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", userId)
          .single();

        if (!profileData?.username) {
          clearStoredRedirect();
          navigate({ to: "/profile", replace: true });
          return;
        }
      }

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
    <div className="relative min-h-screen overflow-hidden px-4 py-6 text-foreground">
      <div className="orb -left-20 top-16 h-72 w-72 bg-indigo/25" />
      <div className="orb right-0 top-0 h-80 w-80 bg-cyan/25" />
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="premium-panel hidden overflow-hidden p-8 lg:block"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white shadow-glow">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              AI-powered video studio
            </div>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-slate-950 xl:text-6xl">
              Create premium videos with cinematic avatars.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-slate-600">
              Turn a prompt into a studio-quality video workflow with smart rendering, avatars, and
              responsive previews.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Prompt to render",
                  body: "Smooth generation flow with live feedback.",
                  icon: Wand2,
                },
                {
                  title: "Secure auth",
                  body: "Supabase sessions stay intact across the app.",
                  icon: Bot,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-950">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-soft">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-chrome text-slate-950 shadow-glow">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-950">One workspace</p>
                  <p>From sign-in to video creation, everything stays visually coherent.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="premium-panel mx-auto w-full max-w-lg p-6 sm:p-8"
        >
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === "sign-in"
                ? "Access the Vaporcast studio and keep your projects moving."
                : "Create your account and unlock the AI video workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={onGoogle}
            disabled={loading || !supabaseClientReady}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.3-.4-3.5z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or email
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
              />
            </label>

            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {error}
              </div>
            )}
            {notice && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !supabaseClientReady}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
            className="mt-4 w-full text-center text-sm text-slate-500 transition hover:text-slate-900"
          >
            {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
