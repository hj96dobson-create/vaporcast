import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Gem, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-[1.65rem] text-slate-950">Billing</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
            Manage your plan, payment methods, and usage spend.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Current plan", value: "Creator Pro" },
            { label: "Renewal date", value: "July 22, 2026" },
            { label: "Credits included", value: "2,000 / month" },
            { label: "Used this cycle", value: "880" },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {row.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{row.value}</p>
            </div>
          ))}

          <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Payment method
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <CreditCard className="h-4 w-4 text-slate-500" />
                Visa ending in 4242
              </div>
              <Button variant="outline" className="rounded-full border-slate-200 bg-white">
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
            <Gem className="h-3.5 w-3.5 text-cyan-300" />
            Premium support
          </div>
          <CardTitle className="font-display text-2xl text-white">Optimize your plan</CardTitle>
          <CardDescription className="text-white/75">
            Upgrade seats or credits as your production volume grows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
            Need 4K exports for all projects? Consider the Studio plan.
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
            Annual billing saves up to 18%.
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Secure checkout and invoice history.
            </span>
          </div>
          <Button className="mt-2 w-full rounded-2xl bg-white text-slate-950 hover:bg-cyan-50">
            View plan options
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
