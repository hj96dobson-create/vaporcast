import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Heart, MessageCircle, Send, Share2, Star, TrendingUp, Users2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/community")({
  component: CommunityPage,
});

function CommunityPage() {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const posts = [
    {
      id: "p1",
      title: "Summer Product Teaser",
      creator: "@maya.studio",
      likes: 284,
      comments: 46,
      shares: 31,
      tag: "Trending",
    },
    {
      id: "p2",
      title: "Founder Story Reel",
      creator: "@noahcreates",
      likes: 198,
      comments: 29,
      shares: 19,
      tag: "Brand",
    },
    {
      id: "p3",
      title: "UGC Style Launch Ad",
      creator: "@alexgrowth",
      likes: 321,
      comments: 63,
      shares: 44,
      tag: "Ads",
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-[1.65rem] text-slate-950">Community</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
            Public inspiration gallery, creator spotlights, and social feedback to shape better
            videos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "Trending now", meta: "124 active creators", icon: Flame },
              { title: "Creator spotlight", meta: "12.4K views this week", icon: Star },
              { title: "Top discussion", meta: "76 comments", icon: MessageCircle },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Icon className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{row.title}</p>
                      <p className="text-xs text-slate-600">{row.meta}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.05 }}
                className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-50"
              >
                <div className="relative aspect-video bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.45),transparent_36%),radial-gradient(circle_at_75%_75%,rgba(167,139,250,0.3),transparent_40%)]" />
                  <div className="absolute left-3 top-3">
                    <Badge className="rounded-full bg-white/20 text-white backdrop-blur">
                      {post.tag}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-base font-semibold tracking-tight text-slate-900">
                      {post.title}
                    </p>
                    <p className="text-sm text-slate-600">by {post.creator}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 px-4 pb-4">
                  <button
                    type="button"
                    onClick={() =>
                      setLikedPosts((current) => ({
                        ...current,
                        [post.id]: !current[post.id],
                      }))
                    }
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                      likedPosts[post.id]
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${likedPosts[post.id] ? "fill-current" : ""}`} />
                    {post.likes + (likedPosts[post.id] ? 1 : 0)}
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post.comments}
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    <Share2 className="h-3.5 w-3.5" />
                    {post.shares}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
            <Users2 className="h-3.5 w-3.5 text-cyan-300" />
            Community pulse
          </div>
          <CardTitle className="font-display text-2xl text-white">Feature requests</CardTitle>
          <CardDescription className="text-white/75">
            Vote, comment, and suggest ideas directly from the roadmap workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { topic: "AI Live Avatars", votes: 412 },
            { topic: "Background Removal", votes: 301 },
            { topic: "AI Music Suggestions", votes: 226 },
          ].map((request) => (
            <div key={request.topic} className="rounded-2xl bg-white/5 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/90">{request.topic}</p>
                <Badge className="rounded-full bg-white/15 text-white">{request.votes} votes</Badge>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/70">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-300" />
              Creator profiles
            </p>
            <div className="mt-3 space-y-2 text-sm text-white/85">
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span>@maya.studio</span>
                <span className="text-cyan-300">9.2K followers</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span>@noahcreates</span>
                <span className="text-cyan-300">7.8K followers</span>
              </div>
            </div>
            <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-50">
              <Send className="h-4 w-4" />
              Share your latest video
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
