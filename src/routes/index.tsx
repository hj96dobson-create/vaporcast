import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Bot,
  Check,
  Clapperboard,
  FileVideo,
  Languages,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic2,
  MessagesSquare,
  Play,
  Sparkles,
  X,
  Wand2,
  Video,
  Zap,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import appPreview from "@/assets/app-preview.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";

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
    title: "AI Video Generation",
    body: "Prompt to polished video with script, scene, and export controls in one flow.",
  },
  {
    icon: Sparkles,
    title: "AI Human Avatars",
    body: "Photoreal presenters with live preview, style controls, and lip-sync support.",
  },
  {
    icon: Video,
    title: "Video Templates",
    body: "Start from premium formats for ads, explainers, launches, and social campaigns.",
  },
  {
    icon: FileVideo,
    title: "Video Library",
    body: "Track render history, duplicate winning edits, and keep outputs organized.",
  },
  {
    icon: MessagesSquare,
    title: "Community Roadmap",
    body: "Vote, comment, and see what’s shipping next across the public roadmap surface.",
  },
  {
    icon: Bot,
    title: "Automation Tools",
    body: "Build repeatable creative workflows with progress, queue health, and status updates.",
  },
];

const roadmapItems = [
  "Public roadmap with voting and comments",
  "Release updates and automatic notifications",
  "Team workflow for approvals and review",
];

const testimonials = [
  {
    quote: "We replaced a £40k/mo UGC budget with Vaporcast and shipped 200 ad variants in a week.",
    name: "Maya Chen",
    role: "Head of Growth, Lumio",
  },
  {
    quote: "It's the first AI video tool where the avatars don't feel uncanny. Our CTR jumped 38%.",
    name: "Daniel Park",
    role: "Founder, Northpeak",
  },
  {
    quote: "From script to multilingual launch in an afternoon. This is the new creative pipeline.",
    name: "Sofia Reyes",
    role: "Creative Director, Halo",
  },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground page-enter">
      <div className="orb -left-24 top-10 h-80 w-80 bg-indigo/25" />
      <div className="orb right-0 top-24 h-96 w-96 bg-cyan/20" />
      <div className="orb left-1/3 top-[42rem] h-80 w-80 bg-lavender/20" />
      <Nav />
      <Hero />
      <TrustedBy />
      <Features />
      <Preview />
      <RoadmapSection />
      <Showcase />
      <CTA />
      <Footer />
      <WaitlistModal />
    </div>
  );
}

function Nav() {
  const { user, loading } = useSession();
  const { profile } = useUserProfile();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (profile?.username ?? user?.email ?? "?").slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="premium-panel mx-auto mt-4 flex max-w-7xl items-center justify-between px-5 py-3">
        <a
          href="#"
          className="flex items-center gap-2 font-display text-lg font-semibold text-slate-950"
        >
          <span className="inline-block h-6 w-6 rounded-xl bg-chrome shadow-glow" />
          Vaporcast
        </a>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-foreground">
            Features
          </a>
          <a href="#preview" className="transition hover:text-foreground">
            Preview
          </a>
          <a href="#roadmap" className="transition hover:text-foreground">
            Roadmap
          </a>
          <a href="#community" className="transition hover:text-foreground">
            Community
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {!loading && !user && (
            <Link
              to="/auth"
              className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:inline"
            >
              Login
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
                <DropdownMenuLabel className="truncate">
                  {profile?.username ?? user.email ?? user.id}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Profile
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
            className="premium-button bg-slate-950 text-white shadow-glow hover:bg-slate-800"
          >
            Start free <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {mobileOpen ? (
        <div className="mx-auto mt-3 max-w-7xl px-4 md:hidden">
          <div className="premium-panel grid gap-2 px-4 py-4 text-sm text-slate-700">
            <a
              href="#features"
              className="rounded-xl px-3 py-2 hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#preview"
              className="rounded-xl px-3 py-2 hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Preview
            </a>
            <a
              href="#roadmap"
              className="rounded-xl px-3 py-2 hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Roadmap
            </a>
            <a
              href="#community"
              className="rounded-xl px-3 py-2 hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Community
            </a>
            <Link
              to="/auth"
              className="rounded-xl px-3 py-2 hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Login / Sign up
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-16">
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1280}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-65"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.16),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.74)_48%,var(--background))]" />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs text-slate-600 shadow-soft backdrop-blur"
          >
            <Zap className="h-3.5 w-3.5 text-indigo" /> New · Vaporcast studio system
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="max-w-xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 md:text-7xl"
          >
            A premium AI studio for <span className="text-gradient">video ads</span> and live
            avatars.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-xl text-lg leading-8 text-slate-600"
          >
            Vaporcast turns prompts into polished videos, live avatar experiences, and repeatable
            creative workflows with the same design language used in the dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#cta"
              className="premium-button bg-slate-950 text-white shadow-glow hover:bg-slate-800"
            >
              Create video <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#preview"
              className="premium-button border border-white/80 bg-white/80 text-slate-700 shadow-soft hover:bg-white"
            >
              <Play className="h-4 w-4" /> See the studio
            </a>
          </motion.div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {[
              ["AI avatars", "Live preview + lip sync"],
              ["Video workflow", "Prompt to render"],
              ["Roadmap + community", "Votes and updates"],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-white/70 bg-white/75 px-4 py-4 text-left shadow-soft backdrop-blur"
              >
                <p className="text-sm font-semibold text-slate-950">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative w-full"
        >
          <div className="absolute inset-x-8 -top-6 -bottom-6 -z-10 rounded-[2rem] bg-chrome opacity-55 blur-3xl" />
          <div className="grid gap-4 xl:grid-cols-[0.38fr_0.62fr]">
            <div className="premium-panel overflow-hidden p-4">
              <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-[0_20px_60px_-32px_rgba(15,23,42,0.8)]">
                <div className="flex items-center justify-between text-xs text-white/65">
                  <span>Studio controls</span>
                  <span>Live</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-white/10 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Avatar</p>
                    <p className="mt-1 text-sm font-medium">Mina</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Voice</p>
                    <p className="mt-1 text-sm font-medium">Creator Female</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Status</p>
                    <p className="mt-1 text-sm font-medium text-cyan-200">Creating your video...</p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-chrome" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["214", "videos this month"],
                  ["98.4%", "success rate"],
                  ["3", "queued renders"],
                  ["1,120", "credits left"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-soft"
                  >
                    <p className="font-display text-xl font-semibold text-slate-950">{value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-panel overflow-hidden p-3">
              <div className="flex items-center gap-1.5 border-b border-white/70 bg-white/70 px-4 py-3 text-left">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-slate-500">live studio preview</span>
              </div>
              <div className="grid gap-4 p-3 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_32%),linear-gradient(160deg,#0f172a,#1e293b)] p-3 text-white shadow-[0_20px_60px_-32px_rgba(15,23,42,0.75)]">
                  <div className="flex items-center justify-between px-2 py-2 text-xs text-white/70">
                    <span>AI avatar</span>
                    <span>Always visible</span>
                  </div>
                  <img
                    src={avatar2}
                    alt="AI avatar preview"
                    className="aspect-[4/5] w-full rounded-[1.25rem] object-cover"
                  />
                </div>
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-soft">
                    <img
                      src={appPreview}
                      alt="Vaporcast app interface"
                      width={1600}
                      height={1100}
                      className="h-auto w-full"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-soft">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Workflow
                      </p>
                      <p className="mt-2 text-sm text-slate-700">
                        Prompt, preview, progress, export.
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-soft">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Avatar
                      </p>
                      <p className="mt-2 text-sm text-slate-700">
                        Large live preview with voice and lip sync.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const names = ["NORTHPEAK", "LUMIO", "HALO", "ARC", "PARALLEL", "FORM&CO"];

  return (
    <section className="border-y border-white/60 bg-white/40 py-10 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by modern marketing teams
        </p>
        <div className="mt-6 grid grid-cols-3 gap-6 md:grid-cols-6">
          {names.map((name) => (
            <div
              key={name}
              className="text-center font-display text-sm font-semibold tracking-[0.15em] text-muted-foreground/70"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const router = useRouter();
  const { user, loading } = useSession();

  function handleFeatureClick(feature: (typeof features)[number]) {
    if (!user && !loading) {
      return router.navigate({ to: "/auth" });
    }

    router.navigate({
      to: "/dashboard/create",
      search: {
        featureTitle: feature.title,
        featureDescription: feature.body,
      },
    });
  }

  return (
    <section id="features" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo">Features</p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Everything you need to <span className="text-gradient">ship video</span>, faster.
          </h2>
          <p className="mt-4 text-muted-foreground">
            One workspace from script to render. No cameras, no editors, no agencies.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.title}
              type="button"
              onClick={() => handleFeatureClick(feature)}
              className="group premium-panel relative p-8 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] focus:outline-none focus:ring-2 focus:ring-indigo/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vapor shadow-glow">
                <feature.icon className="h-5 w-5 text-ink" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Preview() {
  return (
    <section id="preview" className="bg-white/35 py-28 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="premium-panel overflow-hidden border-white/70 bg-white/85 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)]">
            <CardHeader className="space-y-2 border-b border-white/70 bg-white/70 backdrop-blur">
              <p className="text-sm font-medium text-indigo">Live product preview</p>
              <CardTitle className="font-display text-3xl">
                A screen that feels like the dashboard
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Preview avatars, workflow, exports, and roadmap updates before signing up.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "AI avatar preview",
                    body: "Live presenter framing, lip-sync ready playback, and avatar switching in one panel.",
                    icon: Sparkles,
                  },
                  {
                    title: "Video workflow",
                    body: "Prompt, script, style, and generation progress shown exactly like the creator dashboard.",
                    icon: Wand2,
                  },
                  {
                    title: "Video library",
                    body: "See the work queue, completed exports, and your latest renders at a glance.",
                    icon: FileVideo,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-soft"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chrome shadow-glow">
                      <item.icon className="h-4 w-4 text-slate-950" />
                    </div>
                    <h3 className="mt-4 font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_40%),linear-gradient(135deg,#0f172a,#1e293b)] p-3 text-white shadow-[0_20px_70px_-36px_rgba(15,23,42,0.75)]">
                  <div className="flex items-center justify-between border-b border-white/10 px-3 py-3 text-xs text-white/70">
                    <span>AI avatar preview</span>
                    <span>Live animation</span>
                  </div>
                  <img
                    src={avatar2}
                    alt="AI avatar preview"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="font-display text-lg">
                      "Your presenter is ready before the first render."
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      Real preview area, voice setup, and lip-sync controls visible from the start.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                      Workflow
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        1. Prompt enhancer and script builder
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        2. Avatar + style selection with live preview
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        3. Progress tracking and export-ready output
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                      Roadmap
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-700">
                      {roadmapItems.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="premium-panel overflow-hidden border-white/70 bg-white/85 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)]">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Example creations</CardTitle>
                <CardDescription>
                  See how the same look carries through videos, avatars, and the library.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {[avatar1, avatar3, appPreview, avatar4].map((src, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-soft"
                  >
                    <img
                      src={src}
                      alt={`Example creation ${index + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="premium-panel border-white/70 bg-white/85 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)]">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Public platform surface</CardTitle>
                <CardDescription>
                  Feature links, roadmap, community and login all live in the same visual system.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {[
                  "AI Video Generation",
                  "AI Human Avatars",
                  "Video Templates",
                  "Video Library",
                  "Community Roadmap",
                  "Automation Tools",
                ].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {label}
                  </span>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  return (
    <section id="roadmap" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium text-indigo">Roadmap and community</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              From idea to shipping pipeline, all in one place.
            </h2>
            <p className="mt-5 text-muted-foreground">
              A public roadmap, voting, notifications, and internal tracking that feels like the
              rest of Vaporcast instead of a separate product.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "4K vertical, square & horizontal exports",
                "Auto-captioning in 29 languages",
                "Frame-perfect lip sync with Avatar 3.0",
                "Direct publish to TikTok, Reels, YouTube Shorts",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-vapor">
                    <Check className="h-3 w-3 text-ink" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Ideas", "Feature requests and upvotes"],
              ["Planned", "Items queued for the next cycle"],
              ["In Progress", "Active work and progress tracking"],
              ["Released", "Shipped updates and releases"],
            ].map(([title, body]) => (
              <div key={title} className="premium-panel p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
                <p className="mt-3 font-display text-xl text-slate-950">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section id="community" className="bg-white/35 py-28 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="premium-panel p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="font-display text-3xl">Community and social proof</CardTitle>
              <CardDescription>Same design language, same premium rhythm.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-0 pb-0 sm:grid-cols-2">
              {avatars.map((src, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-soft"
                >
                  <img
                    src={src}
                    alt={`Avatar ${index + 1}`}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {testimonials.map((item) => (
              <figure key={item.name} className="premium-panel p-8">
                <blockquote className="font-display text-lg leading-snug">
                  "{item.quote}"
                </blockquote>
                <figcaption className="mt-8 text-sm">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-muted-foreground">{item.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "cta" }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
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
      <div className="premium-panel relative mx-auto max-w-7xl overflow-hidden bg-slate-950 p-12 text-white shadow-glow md:p-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-chrome opacity-50 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-vapor opacity-40 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
              <MessagesSquare className="h-3.5 w-3.5 text-cyan-300" /> Live product surface
            </div>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-6xl">
              Your next campaign lives inside a single premium workspace.
            </h2>
            <p className="mt-5 max-w-lg text-white/70">
              Join creators and teams shipping with Vaporcast: avatars, templates, roadmap,
              community, and automation in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/auth"
                className="premium-button bg-chrome text-ink shadow-glow hover:opacity-90"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#preview"
                className="premium-button border border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <Bot className="h-4 w-4" /> Explore the studio
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">What’s included</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "AI avatar studio",
                  "Video generation workflow",
                  "Video library",
                  "Roadmap voting and updates",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/85"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Early access</p>
              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                noValidate
              >
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cta-email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={255}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={status === "loading"}
                  placeholder="you@brand.com"
                  className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-chrome px-6 py-3 text-sm font-medium text-ink transition hover:opacity-90 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    "Joining…"
                  ) : (
                    <>
                      Start free <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              <p
                role={status === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`mt-3 text-xs ${status === "success" ? "text-cyan" : status === "error" ? "text-destructive" : "text-white/40"}`}
              >
                {message || "No credit card. 3 free renders."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/60 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-5 w-5 rounded-lg bg-chrome shadow-glow" />
          <span className="font-display font-semibold text-foreground">Vaporcast</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#roadmap" className="hover:text-foreground">
            Roadmap
          </a>
          <a href="#community" className="hover:text-foreground">
            Community
          </a>
        </div>
      </div>
    </footer>
  );
}
