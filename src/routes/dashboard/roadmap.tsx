import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Flame, Sparkles, Vote } from "lucide-react";

export const Route = createFileRoute("/dashboard/roadmap")({
  component: RoadmapPage,
});

const columns = [
  {
    title: "Ideas",
    emoji: "💡",
    items: [
      { title: "AI Thumbnail Generator", votes: 138, progress: 10, priority: "Medium", eta: "Q4" },
      { title: "Creator profile themes", votes: 79, progress: 5, priority: "Low", eta: "Q4" },
    ],
  },
  {
    title: "Planned",
    emoji: "📋",
    items: [
      { title: "Voice Cloning", votes: 244, progress: 25, priority: "High", eta: "Q3" },
      { title: "AI Translation", votes: 212, progress: 22, priority: "High", eta: "Q3" },
    ],
  },
  {
    title: "In Progress",
    emoji: "🚧",
    items: [
      { title: "Prompt Enhancer", votes: 286, progress: 64, priority: "High", eta: "This month" },
      {
        title: "Community voting",
        votes: 173,
        progress: 58,
        priority: "Medium",
        eta: "This month",
      },
    ],
  },
  {
    title: "Testing",
    emoji: "🧪",
    items: [
      { title: "AI Dubbing", votes: 190, progress: 82, priority: "High", eta: "Next release" },
    ],
  },
  {
    title: "Released",
    emoji: "✅",
    items: [
      { title: "Avatar Gallery", votes: 301, progress: 100, priority: "Done", eta: "Live" },
      { title: "Render polling", votes: 267, progress: 100, priority: "Done", eta: "Live" },
    ],
  },
] as const;

type VoteState = Record<string, number>;

function RoadmapPage() {
  const [suggestion, setSuggestion] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([
    "Add one-click multilingual subtitle packs",
    "Provide A/B thumbnail generation presets",
  ]);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<string[]>([
    "Prompt Enhancer saved us a lot of iteration time.",
    "Would love export presets for LinkedIn and YouTube Shorts.",
  ]);

  const [votes, setVotes] = useState<VoteState>(() => {
    const initial: VoteState = {};
    for (const column of columns) {
      for (const item of column.items) {
        initial[item.title] = item.votes;
      }
    }
    return initial;
  });

  const totalVotes = useMemo(
    () => Object.values(votes).reduce((sum, value) => sum + value, 0),
    [votes],
  );

  return (
    <div className="space-y-6">
      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Community roadmap
          </div>
          <CardTitle className="font-display text-[1.65rem] text-slate-950">
            Public roadmap
          </CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-6 text-slate-600">
            Track feature delivery from ideas to release, vote on priorities, and watch progress
            move in real time.
          </CardDescription>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total votes</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{totalVotes}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">In progress</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">2 active</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Next release</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">AI Dubbing</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-5">
        {columns.map((column) => (
          <Card
            key={column.title}
            className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur"
          >
            <CardHeader>
              <CardTitle className="font-display text-xl text-slate-950">
                {column.emoji} {column.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                    ETA: {item.eta}
                  </p>
                  <div className="mt-3 space-y-2">
                    <Progress value={item.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{item.progress}%</span>
                      <span>{votes[item.title]} votes</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {item.priority}
                    </Badge>
                    <button
                      type="button"
                      onClick={() =>
                        setVotes((current) => ({
                          ...current,
                          [item.title]: current[item.title] + 1,
                        }))
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <Vote className="h-3.5 w-3.5" />
                      Vote
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl text-slate-950">
            How priorities are set
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-600">
            A blended model of community votes, strategic impact, and implementation complexity.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <Flame className="mb-2 h-4 w-4 text-amber-500" />
            Community demand has the highest weight for roadmap ordering.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <ArrowUpRight className="mb-2 h-4 w-4 text-emerald-600" />
            Features with measurable growth impact are accelerated.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <Sparkles className="mb-2 h-4 w-4 text-sky-600" />
            Delivery confidence updates after each sprint milestone.
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl text-slate-950">
              Suggestions and comments
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              Submit feature ideas and leave roadmap feedback for the product team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Suggest a feature
              </label>
              <div className="flex gap-2">
                <input
                  value={suggestion}
                  onChange={(event) => setSuggestion(event.target.value)}
                  placeholder="Type your feature request"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!suggestion.trim()) return;
                    setSuggestions((current) => [suggestion.trim(), ...current].slice(0, 6));
                    setSuggestion("");
                  }}
                  className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {suggestions.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Leave a comment
              </label>
              <textarea
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                rows={3}
                placeholder="What should we improve next?"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-300"
              />
              <button
                type="button"
                onClick={() => {
                  if (!commentDraft.trim()) return;
                  setComments((current) => [commentDraft.trim(), ...current].slice(0, 6));
                  setCommentDraft("");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Post comment
              </button>
              <div className="space-y-2">
                {comments.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-white">Trending requests</CardTitle>
            <CardDescription className="text-white/75">
              Popular roadmap asks and notification highlights from this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Auto B-roll scene generator",
              "Brand-safe style lock presets",
              "One-click campaign duplication",
            ].map((request) => (
              <div key={request} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
                {request}
              </div>
            ))}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-white/70">Notifications</p>
              <div className="mt-3 space-y-2 text-sm text-white/85">
                <p className="rounded-xl bg-white/5 px-3 py-2">Prompt Enhancer moved to Testing</p>
                <p className="rounded-xl bg-white/5 px-3 py-2">
                  AI Dubbing release candidate ready
                </p>
                <p className="rounded-xl bg-white/5 px-3 py-2">
                  2 new community suggestions accepted
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
