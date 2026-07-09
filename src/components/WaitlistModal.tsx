import { useEffect, useState, type FormEvent } from "react";
import { X, Crown, Sparkles, Check, Loader2, ArrowRight } from "lucide-react";

const STORAGE_KEY = "vaporcast_waitlist_modal_seen";
const SIGNUP_KEY = "vaporcast_waitlist_signup";
const VIP_CAP = 10;

type TierStatus = {
  confirmedCount: number;
  vipCap: number;
  tier: "vip" | "standard";
  vipSpotsLeft: number;
};

export function WaitlistModal() {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<TierStatus | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1" || localStorage.getItem(SIGNUP_KEY) === "1")
        return;
    } catch {
      /* ignore storage errors */
    }
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open || tier) return;
    fetch("/api/waitlist/tier")
      .then((r) => r.json())
      .then((d: TierStatus) => setTier(d))
      .catch(() =>
        setTier({
          confirmedCount: 0,
          vipCap: VIP_CAP,
          tier: "vip",
          vipSpotsLeft: VIP_CAP,
        }),
      );
  }, [open, tier]);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage modal" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(
        data.message ?? "Check your inbox — we sent a confirmation link to secure your spot.",
      );
      try {
        localStorage.setItem(SIGNUP_KEY, "1");
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setTimeout(() => setOpen(false), 3500);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (!open) return null;

  const isVipTier = !tier || tier.confirmedCount < VIP_CAP;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        onClick={close}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl border bg-card p-8 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Almost there</h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          </div>
        ) : isVipTier ? (
          <>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
              <Crown className="h-3.5 w-3.5" />
              Founding VIP · {tier ? tier.vipSpotsLeft : VIP_CAP} spots left
            </div>
            <h2 id="waitlist-modal-title" className="mt-4 text-2xl font-semibold tracking-tight">
              🔥 Founding VIP Members
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The first 10 confirmed users receive{" "}
              <strong className="text-foreground">50% off any plan for 6 months</strong> after
              launch.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {[
                "50% discount for 6 months",
                "VIP badge in-app",
                "Early access to new features",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800">
              <Sparkles className="h-3.5 w-3.5" />
              Early access
            </div>
            <h2 id="waitlist-modal-title" className="mt-4 text-2xl font-semibold tracking-tight">
              Join the waitlist
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Get early access and <strong className="text-foreground">10% off any plan</strong>{" "}
              after launch.
            </p>
          </>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-3" noValidate>
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            type="email"
            required
            autoComplete="email"
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            placeholder="you@brand.com"
            className="w-full rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending confirmation…
              </>
            ) : (
              <>
                {isVipTier ? "Claim my VIP spot" : "Join the waitlist"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          {status === "error" && (
            <p role="alert" className="text-xs text-destructive">
              {message}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground text-center">
            We'll send a confirmation link. No spam.
          </p>
        </form>
      </div>
    </div>
  );
}
