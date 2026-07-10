import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { vaporcastRoadmap } from "@/lib/vaporcast-roadmap";

export function RoadmapPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {vaporcastRoadmap.map((phase, index) => {
        const Icon = phase.icon;

        return (
          <Card
            key={phase.title}
            className={`overflow-hidden border-white/70 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur ${
              index === 0
                ? "bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-white"
                : "bg-white/85"
            }`}
          >
            <CardHeader className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
                <Icon className="h-3.5 w-3.5 text-cyan-300" />
                Phase {index + 1}
              </div>
              <CardTitle
                className={`font-display text-2xl ${index === 0 ? "text-white" : "text-slate-950"}`}
              >
                {phase.title}
              </CardTitle>
              <CardDescription className={index === 0 ? "text-white/70" : "text-slate-500"}>
                {phase.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {phase.items.map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    index === 0 ? "bg-white/5 text-white/80" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
