import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import {
  Sparkles,
  Wand2,
  Languages,
  Mic2,
  Video,
  Clapperboard,
  ArrowRight,
  Play,
  Check,
  Zap,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import appPreview from "@/assets/app-preview.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vaporcast — AI Video Ads in Minutes" },
      {
        name: "description",
        content:
          "Turn a single prompt into studio-grade video ads with lifelike AI avatars, voices, and scripts. Ship campaigns 10× faster.",
      },
      { property: "og:title", content: "Vaporcast — AI Video Ads in Minutes" },
      {
        property: "og:description",
        content:
          "Turn a single prompt into studio-grade video ads with lifelike AI avatars, voices, and scripts.",
      },
    ],
  }),
  component: Landing,
});

const avatars = [avatar1, avatar2, avatar3, avatar4];

const features = [
  {
    icon: Wand2,
    title: "Prompt to video",
    body: "Paste a product URL or a sentence. We script, storyboard, and render in minutes.",
  },
  {
    icon: Sparkles,
    title: "Lifelike AI avatars",
    body: "300+ photoreal presenters across ages, looks, and regions. Or clone yourself.",
  },
  {
    icon: Languages,
    title: "29 languages",
    body: "Localize an ad into Spanish, Japanese, Arabic and more — lip-synced perfectly.",
  },
  {
    icon: Mic2,
    title: "Studio voices",
    body: "Natural intonation and emotion. Tune pace, pitch, and personality per scene.",
  },
  {
    icon: Video,
    title: "B-roll & captions",
    body: "Automatic broll, subtitles, music beds, and motion graphics built in.",
  },
  {
    icon: Clapperboard,
    title: "Batch & A/B test",
    body: "Generate 50 variants of a hook in one click. Find the winner faster.",
  },
];

const steps = [
  { n: "01", t: "Drop a link or idea", d: "Vaporcast scrapes your brand, voice, and product." },
  { n: "02", t: "Pick an avatar & vibe", d: "Choose a presenter, language, and pacing." },
  { n: "03", t: "Render in minutes", d: "Download MP4s ready for TikTok, Reels, YouTube." },
];

const testimonials = [
  {
    quote:
      "We replaced a £40k/mo UGC budget with Vaporcast and shipped 200 ad variants in a week.",
    name: "Maya Chen",
    role: "Head of Growth, Lumio",
  },
  {
    quote:
      "It's the first AI video tool where the avatars don't feel uncanny. Our CTR jumped 38%.",
    name: "Daniel Park",
    role: "Founder, Northpeak",
  },
  {
    quote:
      "From script to multilingual launch in an afternoon. This is the new creative pipeline.",
    name: "Sofia Reyes",
    role: "Creative Director, Halo",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Logos />
      <Features />
      <Showcase />
      <Steps />
      <Avatars />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
      <WaitlistModal />
    </div>
  );
}

function Nav() {
  const { user, loading } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
  };

  const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full glass px-5 py-3">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="inline-block h-6 w-6 rounded-md bg-chrome shadow-glow" />
          Vaporcast
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#avatars" className="hover:text-foreground transition">Avatars</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          {!loading && !user && (
            <Link to="/auth" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
              Sign in
            </Link>
          )}
          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <a
            href="#cta"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Start free <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24">
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1280}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground"
        >
          <Zap className="h-3.5 w-3.5 text-indigo" />
          New · Avatar 3.0 — photoreal lip sync
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          Studio-grade <span className="text-gradient">video ads</span>
          <br />from a single prompt.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Vaporcast turns a link or idea into scripted, voiced, and rendered videos
          with lifelike AI avatars — in 29 languages, ready to ship in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Create your first video <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground transition hover:bg-white"
          >
            <Play className="h-4 w-4" /> Watch 60s demo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="absolute inset-x-12 -top-6 -bottom-6 -z-10 rounded-[2rem] bg-chrome opacity-60 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <img
              src={appPreview}
              alt="Vaporcast app interface"
              width={1600}
              height={1100}
              className="h-auto w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Logos() {
  const names = ["NORTHPEAK", "LUMIO", "HALO", "ARC", "PARALLEL", "FORM&CO"];
  return (
    <section className="border-y bg-secondary/40 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by modern marketing teams
        </p>
        <div className="mt-6 grid grid-cols-3 gap-6 md:grid-cols-6">
          {names.map((n) => (
            <div
              key={n}
              className="text-center font-display text-sm font-semibold tracking-[0.15em] text-muted-foreground/70"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo">Features</p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Everything you need to <span className="text-gradient">ship video</span>, faster.
          </h2>
          <p className="mt-4 text-muted-foreground">
            One workspace from script to render. No cameras, no editors, no agencies.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-card p-8 transition hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vapor shadow-glow">
                <f.icon className="h-5 w-5 text-ink" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section id="showcase" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-indigo">The render</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              From <em className="not-italic text-gradient">prompt</em> to{" "}
              <em className="not-italic text-gradient">post</em> in under 4 minutes.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Generate hooks, B-roll, captions, and a finished MP4 ready for any feed.
              Every render is brand-aware and editable scene by scene.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "4K vertical, square & horizontal exports",
                "Auto-captioning in 29 languages",
                "Frame-perfect lip sync with Avatar 3.0",
                "Direct publish to TikTok, Reels, YouTube Shorts",
              ].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-vapor">
                    <Check className="h-3 w-3 text-ink" />
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-chrome opacity-50 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border bg-card shadow-soft">
              <div className="flex items-center gap-1.5 border-b bg-secondary/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-muted-foreground">render · scene 03 of 06</span>
              </div>
              <div className="relative aspect-[4/5] bg-ink">
                <img
                  src={avatar2}
                  alt="AI presenter"
                  loading="lazy"
                  width={512}
                  height={640}
                  className="absolute inset-0 h-full w-full object-cover opacity-95"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6">
                  <p className="font-display text-xl text-white">
                    "Switching to Vaporcast cut our shoot costs by 92%."
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-3/5 bg-chrome" />
                    </div>
                    <span className="text-xs text-white/70">0:18 / 0:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section id="how" className="bg-secondary/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-indigo">How it works</p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Three steps. <span className="text-gradient">One finished ad.</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl border bg-card p-8 shadow-soft">
              <div className="font-display text-5xl font-semibold text-gradient">{s.n}</div>
              <h3 className="mt-6 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Avatars() {
  return (
    <section id="avatars" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-indigo">Avatars</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              300+ presenters. <span className="text-gradient">Or clone yourself.</span>
            </h2>
          </div>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Browse the library →
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {avatars.map((src, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border bg-card shadow-soft"
            >
              <img
                src={src}
                alt={`AI avatar ${i + 1}`}
                loading="lazy"
                width={512}
                height={640}
                className="aspect-[4/5] h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <span className="font-display text-sm font-medium">
                    {["Maya", "Theo", "Lila", "Arthur"][i]}
                  </span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur">
                    {["EN · ES", "EN · FR", "EN · JA", "EN · DE"][i]}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-indigo">Loved by creators</p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            The new <span className="text-gradient">creative pipeline.</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-3xl border bg-card p-8 shadow-soft"
            >
              <blockquote className="font-display text-lg leading-snug">"{t.quote}"</blockquote>
              <figcaption className="mt-8 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const tiers = [
  {
    name: "Starter",
    price: "£0",
    sub: "Try Vaporcast free",
    feats: ["3 videos / month", "720p export", "20+ avatars", "Watermark"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Creator",
    price: "£49",
    sub: "per month, billed monthly",
    feats: ["100 videos / month", "4K export", "All 300+ avatars", "29 languages", "No watermark"],
    cta: "Start 7-day trial",
    highlight: true,
  },
  {
    name: "Studio",
    price: "Custom",
    sub: "For teams & agencies",
    feats: ["Unlimited renders", "Custom avatar cloning", "API access", "SSO & SLA"],
    cta: "Talk to sales",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="bg-secondary/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-indigo">Pricing</p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Simple plans. <span className="text-gradient">Outrageous output.</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-8 shadow-soft ${
                t.highlight
                  ? "border-transparent bg-ink text-white"
                  : "bg-card"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-chrome px-3 py-1 text-xs font-medium text-ink">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{t.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">{t.price}</span>
              </div>
              <p className={`mt-1 text-sm ${t.highlight ? "text-white/60" : "text-muted-foreground"}`}>
                {t.sub}
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className={`h-4 w-4 ${t.highlight ? "text-cyan" : "text-indigo"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${
                  t.highlight
                    ? "bg-chrome text-ink hover:opacity-90"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "cta" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage("You're on the list — check your inbox soon.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section id="cta" className="px-6 py-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border bg-ink p-12 text-white shadow-glow md:p-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-chrome opacity-50 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-vapor opacity-40 blur-3xl" />

        <div className="relative max-w-2xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
            Your next ad is
            <br />
            <span className="text-gradient">one prompt away.</span>
          </h2>
          <p className="mt-5 max-w-lg text-white/70">
            Join 80,000+ marketers, founders, and creators rendering with Vaporcast.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
            noValidate
          >
            <label htmlFor="cta-email" className="sr-only">Email address</label>
            <input
              id="cta-email"
              type="email"
              required
              autoComplete="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              placeholder="you@brand.com"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-chrome px-6 py-3 text-sm font-medium text-ink transition hover:opacity-90 disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : (<>Start free <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </form>
          <p
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`mt-3 text-xs ${
              status === "success"
                ? "text-cyan"
                : status === "error"
                  ? "text-destructive"
                  : "text-white/40"
            }`}
          >
            {message || "No credit card. 3 free renders."}
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-block h-5 w-5 rounded-md bg-chrome" />
          <span className="font-display font-semibold text-foreground">Vaporcast</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
