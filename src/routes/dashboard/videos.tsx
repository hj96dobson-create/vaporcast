import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CirclePlay,
  Clock3,
  Copy,
  Download,
  Filter,
  Search,
  Sparkles,
  Star,
  Upload,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/videos")({
  component: MyVideosPage,
});

const jobs = [
  {
    id: "job_9812",
    title: "Product launch teaser",
    status: "processing",
    avatar: "Avery",
    createdAt: "2 minutes ago",
    duration: "18s",
    category: "Ads",
    format: "MP4",
  },
  {
    id: "job_9811",
    title: "Holiday campaign cut",
    status: "complete",
    avatar: "Mina",
    createdAt: "14 minutes ago",
    duration: "24s",
    category: "Campaigns",
    format: "WebM",
  },
  {
    id: "job_9809",
    title: "Founder update video",
    status: "failed",
    avatar: "Noah",
    createdAt: "32 minutes ago",
    duration: "32s",
    category: "Company",
    format: "MP4",
  },
  {
    id: "job_9808",
    title: "Feature rollout reel",
    status: "complete",
    avatar: "Sora",
    createdAt: "1 hour ago",
    duration: "22s",
    category: "Product",
    format: "GIF",
  },
];

function MyVideosPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyboardSearch = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const tagName = target?.tagName?.toLowerCase();
        if (tagName === "input" || tagName === "textarea") return;
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboardSearch);
    return () => window.removeEventListener("keydown", handleKeyboardSearch);
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((job) => job.category)))],
    [],
  );

  const filteredJobs = useMemo(() => {
    const withFilters = jobs.filter((job) => {
      const inCategory = activeCategory === "All" || job.category === activeCategory;
      const inStatus = activeStatus === "All" || job.status === activeStatus;
      const inQuery =
        query.trim().length === 0 ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.avatar.toLowerCase().includes(query.toLowerCase());
      return inCategory && inStatus && inQuery;
    });

    const ordered = [...withFilters];
    if (sortBy === "A-Z") {
      ordered.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "Status") {
      const rank: Record<string, number> = { processing: 0, complete: 1, failed: 2 };
      ordered.sort((a, b) => rank[a.status] - rank[b.status]);
    }
    return ordered;
  }, [activeCategory, activeStatus, query, sortBy]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="font-display text-[1.65rem] text-slate-950">My videos</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
            Browse your AI video library with smart filters, categories, and quick preview actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search videos, avatars, or campaigns"
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 bg-white shadow-sm"
              title="Press / to search"
            >
              <Filter className="h-4 w-4" />
              Advanced filter
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Status
              </span>
              <select
                value={activeStatus}
                onChange={(event) => setActiveStatus(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-300"
              >
                <option value="All">All statuses</option>
                <option value="processing">Processing</option>
                <option value="complete">Complete</option>
                <option value="failed">Failed</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-300"
              >
                <option value="Newest">Newest</option>
                <option value="A-Z">A-Z</option>
                <option value="Status">Status</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeCategory === category
                    ? "bg-slate-950 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredJobs.map((job, index) => (
              <motion.article
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-50 shadow-sm"
              >
                <div className="relative aspect-video overflow-hidden bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.42),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(167,139,250,0.32),transparent_36%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <Badge className="rounded-full bg-white/15 text-white backdrop-blur">
                      {job.duration}
                    </Badge>
                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition group-hover:scale-105">
                      <CirclePlay className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold tracking-tight text-slate-950">
                        {job.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs leading-6 text-slate-600">
                        <span>{job.avatar}</span>
                        <span>•</span>
                        <span>{job.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        {job.category}
                      </Badge>
                      <button
                        type="button"
                        onClick={() =>
                          setFavoriteIds((current) =>
                            current.includes(job.id)
                              ? current.filter((id) => id !== job.id)
                              : [...current, job.id],
                          )
                        }
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                          favoriteIds.includes(job.id)
                            ? "border-amber-300 bg-amber-50 text-amber-600"
                            : "border-slate-200 bg-white text-slate-500"
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${favoriteIds.includes(job.id) ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium capitalize text-slate-700">
                      {job.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge className="rounded-full bg-slate-100 text-slate-700">
                        {job.format}
                      </Badge>
                      <Button
                        variant="outline"
                        className="rounded-full border-slate-200 bg-white shadow-sm text-slate-700"
                      >
                        {job.status === "complete" ? (
                          <CirclePlay className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Open
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                      <Copy className="h-3.5 w-3.5" />
                      Duplicate
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                      <Download className="h-3.5 w-3.5" />
                      Export
                    </button>
                  </div>

                  {job.status === "processing" && (
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-slate-950 via-sky-600 to-cyan-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center">
              <Video className="mx-auto h-5 w-5 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-900">
                No videos match this filter
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Try another category or clear your search query.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-white">Queue health</CardTitle>
            <CardDescription className="text-white/70">
              Real-time queue status for generation and retry operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm">
              <span className="font-medium text-white/90">Processing</span>
              <span className="text-cyan-300">1 active</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm">
              <span className="font-medium text-white/90">Completed today</span>
              <span className="text-emerald-300">12 videos</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm">
              <span className="font-medium text-white/90">Failures</span>
              <span className="text-amber-300">0 pending retry</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl text-slate-950">Quick actions</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              Jump back into generation or upload new assets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              className="w-full justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-sm hover:bg-slate-800"
            >
              <Link to="/dashboard/create">
                Create new video
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between rounded-2xl border-slate-200 bg-white shadow-sm"
            >
              <Upload className="h-4 w-4" />
              Upload assets
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between rounded-2xl border-slate-200 bg-white shadow-sm"
            >
              <Clock3 className="h-4 w-4" />
              View activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
