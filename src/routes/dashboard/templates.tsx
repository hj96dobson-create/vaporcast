import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Layers3, Sparkles, Wand2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/templates")({
  component: TemplatesPage,
});

const templates = [
  {
    name: "Product Launch",
    description: "High-energy demo with bold hook and CTA.",
    avatar: "Professional",
    tone: "Premium",
  },
  {
    name: "Social Ad",
    description: "Fast-cut vertical ad for paid social.",
    avatar: "Casual",
    tone: "Conversion",
  },
  {
    name: "Founder Story",
    description: "Narrative-driven intro for brand trust.",
    avatar: "Storyteller",
    tone: "Authentic",
  },
  {
    name: "Enterprise Demo",
    description: "Polished pitch for B2B and enterprise buyers.",
    avatar: "Corporate",
    tone: "Confident",
  },
];

function TemplatesPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-[1.65rem] text-slate-950">Templates</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
            Ready-made structures for high-converting AI videos, with enough flexibility to adapt to
            each campaign.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {templates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-glow">
                  <Layers3 className="h-5 w-5" />
                </div>
                <Badge className="rounded-full bg-white text-slate-700">{template.tone}</Badge>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-slate-950">
                {template.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{template.description}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Avatar style: {template.avatar}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
            <Wand2 className="h-3.5 w-3.5 text-cyan-300" />
            Guided creation
          </div>
          <CardTitle className="font-display text-2xl text-white">Start from a template</CardTitle>
          <CardDescription className="text-white/75">
            Templates can prefill prompt structure, avatar choice, pacing, and CTA flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-white/5 p-4 text-sm leading-6 text-white/80">
            Use a template to speed up setup without losing control over the final tone or visual
            style.
          </div>
          <Button
            asChild
            className="w-full justify-between rounded-2xl bg-white text-slate-950 hover:bg-cyan-50"
          >
            <Link to="/dashboard/create">
              Create from template
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
