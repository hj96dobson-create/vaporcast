import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic2, Music2, SlidersHorizontal, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/voices")({
  component: VoicesPage,
});

const voices = [
  { name: "Nova", tone: "Energetic", lang: "EN" },
  { name: "Aria", tone: "Calm", lang: "EN / FR" },
  { name: "Kai", tone: "Confident", lang: "EN / DE" },
  { name: "Sora", tone: "Narrative", lang: "EN / JA" },
];

function VoicesPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <Card className="border-white/70 bg-white/85 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-[1.65rem] text-slate-950">AI Voices</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
            Select voice styles for future dubbing and script-to-speech workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {voices.map((voice) => (
            <div
              key={voice.name}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{voice.name}</p>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
                  {voice.lang}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{voice.tone}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white shadow-[0_18px_70px_-42px_rgba(15,23,42,0.7)]">
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
            <Mic2 className="h-3.5 w-3.5 text-cyan-300" />
            Voice design
          </div>
          <CardTitle className="font-display text-2xl text-white">
            Future-ready voice stack
          </CardTitle>
          <CardDescription className="text-white/75">
            This page is prepared for voice cloning, translation, and dubbing controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
              Pitch, cadence, and emphasis controls
            </span>
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <Music2 className="h-4 w-4 text-violet-300" />
              Background music mixing presets
            </span>
          </div>
          <Button
            asChild
            className="mt-2 w-full rounded-2xl bg-white text-slate-950 hover:bg-cyan-50"
          >
            <Link to="/dashboard/create">
              <Sparkles className="h-4 w-4" />
              Use voice in create flow
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
