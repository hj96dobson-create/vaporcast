import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Crown, AlertCircle, Loader2 } from "lucide-react";

type Status = "loading" | "confirmed" | "invalid" | "error";

export const Route = createFileRoute("/confirm-waitlist")({
  head: () => ({
    meta: [
      { title: "Confirm your Vaporcast Early Access" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ConfirmPage,
});

function ConfirmPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setStatus("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `/api/waitlist/confirm?token=${encodeURIComponent(token)}`,
        );
        const data = (await res.json().catch(() => ({}))) as {
          status?: Status;
          isFoundingVip?: boolean;
        };
        if (data.status === "confirmed") {
          setIsVip(!!data.isFoundingVip);
          setStatus("confirmed");
        } else if (data.status === "invalid") {
          setStatus("invalid");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full rounded-3xl border bg-card p-10 shadow-soft text-center">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Confirming your email…
            </p>
          </>
        )}

        {status === "confirmed" && isVip && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
              <Crown className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold">
              You're a Founding VIP 🎉
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              You've secured a Founding VIP spot — <strong>50% off any plan for 6 months</strong> after launch, plus early access and priority support.
            </p>
          </>
        )}

        {status === "confirmed" && !isVip && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold">You're confirmed</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your spot on the waitlist is locked in. You'll get{" "}
              <strong>10% off any plan</strong> after launch.
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold">Link expired</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              This confirmation link is invalid or has already been used. Try
              joining the waitlist again from the homepage.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We couldn't confirm your email. Please try again in a moment.
            </p>
          </>
        )}

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Back to Vaporcast
        </Link>
      </div>
    </div>
  );
}
