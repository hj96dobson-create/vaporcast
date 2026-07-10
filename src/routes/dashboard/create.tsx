import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { AvatarGallery } from "@/components/video/AvatarGallery";
import { defaultVideoAvatarId, type VideoAvatarId } from "@/lib/video-avatars";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Wand2,
  ArrowRight,
  Gauge,
  Ratio,
  Timer,
  Video,
  Mic2,
  Layers3,
  BrainCircuit,
  Clapperboard,
  Copy,
  Heart,
  Save,
  ScrollText,
  LayoutTemplate,
  Lightbulb,
} from "lucide-react";

type CreateSearch = {
  avatar?: string;
};

const promptSuggestions = [
  "Create a 15-second launch teaser for our new productivity app with energetic pacing and a strong CTA.",
  "Generate a testimonial-style ad highlighting how Vaporcast reduced editing time by 80%.",
  "Build a cinematic product reveal with bold typography and upbeat voiceover for social feeds.",
];

const styleOptions = ["Cinematic", "UGC", "Corporate", "Minimal"];
const resolutionOptions = ["1080p", "1440p", "4K"];
const durationOptions = ["15s", "30s", "45s", "60s"];
const aspectRatioOptions = ["9:16", "1:1", "16:9"];
const cameraOptions = ["Static", "Slow Push", "Parallax", "Dynamic Cuts"];
const voiceOptions = ["Nova", "Aria", "Kai", "Sora"];
const templateOptions = ["Product Launch", "Founder Story", "Seasonal Offer", "Social Ad"];
const formatOptions = ["MP4", "WebM", "GIF"];
const projectCategoryOptions = ["Ads", "Social", "Product", "Brand", "Community"];

type ProjectVersion = {
  id: string;
  title: string;
  prompt: string;
  template: string;
  savedAt: string;
};

type ScenePlanItem = {
  scene: number;
  duration: string;
  objective: string;
  visualDirection: string;
};

export const Route = createFileRoute("/dashboard/create")({
  validateSearch: (search: Record<string, unknown>): CreateSearch => ({
    avatar: typeof search.avatar === "string" ? search.avatar : undefined,
  }),
  component: CreateVideoPage,
});

function CreateVideoPage() {
  const { session, loading } = useSession();
  const router = useRouter();
  const { avatar } = Route.useSearch();
  const [prompt, setPrompt] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<VideoAvatarId>(() => {
    return avatar && avatar.startsWith("avatar-")
      ? (avatar as VideoAvatarId)
      : defaultVideoAvatarId;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(8);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [selectedResolution, setSelectedResolution] = useState(resolutionOptions[0]);
  const [selectedDuration, setSelectedDuration] = useState(durationOptions[1]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(aspectRatioOptions[0]);
  const [selectedCamera, setSelectedCamera] = useState(cameraOptions[0]);
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(templateOptions[0]);
  const [selectedFormat, setSelectedFormat] = useState(formatOptions[0]);
  const [projectTitle, setProjectTitle] = useState("Untitled video project");
  const [projectCategory, setProjectCategory] = useState(projectCategoryOptions[0]);
  const [favoriteProject, setFavoriteProject] = useState(false);
  const [scriptDraft, setScriptDraft] = useState("");
  const [scenePlan, setScenePlan] = useState<ScenePlanItem[]>([]);
  const [projectVersions, setProjectVersions] = useState<ProjectVersion[]>([]);
  const [showOnboardingTip, setShowOnboardingTip] = useState(true);
  const isProcessing = jobStatus === "processing";
  const isComplete = jobStatus === "complete";
  const showResult = Boolean(jobId && (isComplete || videoUrl));
  const draftStorageKey = "vaporcast:create:drafts";

  const assistantIdeas = useMemo(
    () => [
      `Build a ${selectedDuration} ${selectedStyle.toLowerCase()} ad focused on a one-line value proposition and a punchy CTA.`,
      `Use ${selectedAspectRatio} framing with ${selectedCamera.toLowerCase()} camera movement for stronger mobile retention.`,
      `Test ${selectedVoice} voice-over with a 3-scene narrative: hook, proof, action.`,
    ],
    [selectedAspectRatio, selectedCamera, selectedDuration, selectedStyle, selectedVoice],
  );

  function parseDurationSeconds(durationLabel: string) {
    const seconds = Number.parseInt(durationLabel, 10);
    return Number.isFinite(seconds) ? seconds : 30;
  }

  function createScenePlanFromPrompt(basePrompt: string) {
    const totalSeconds = parseDurationSeconds(selectedDuration);
    const sceneCount = totalSeconds <= 20 ? 3 : totalSeconds <= 45 ? 4 : 5;
    const sceneLength = `${Math.max(4, Math.round(totalSeconds / sceneCount))}s`;
    const topic = basePrompt.trim() || "your product";

    const generated: ScenePlanItem[] = [
      {
        scene: 1,
        duration: sceneLength,
        objective: "Hook attention in first 2 seconds",
        visualDirection: `Bold opening shot using ${selectedStyle.toLowerCase()} visuals for ${topic.slice(0, 80)}.`,
      },
      {
        scene: 2,
        duration: sceneLength,
        objective: "Show core benefit",
        visualDirection: `Feature-focused shot with ${selectedCamera.toLowerCase()} movement and ${selectedAspectRatio} framing.`,
      },
      {
        scene: 3,
        duration: sceneLength,
        objective: "Add proof or credibility",
        visualDirection: "Overlay social proof, quick stat card, or testimonial-style quote.",
      },
      {
        scene: 4,
        duration: sceneLength,
        objective: "Strong CTA",
        visualDirection: "Brand lockup + direct call to action with high-contrast end card.",
      },
    ].slice(0, sceneCount);

    setScenePlan(generated);
  }

  function createScriptFromPrompt(basePrompt: string) {
    const safePrompt = basePrompt.trim() || "Promote Vaporcast";
    const generatedScript = [
      "[Hook]",
      `${safePrompt}.`,
      "",
      "[Body]",
      `Introduce the value in clear language, then highlight one concrete outcome in ${selectedDuration}.`,
      "",
      "[CTA]",
      "Start creating with Vaporcast today.",
    ].join("\n");

    setScriptDraft(generatedScript);
  }

  function saveDraftVersion() {
    const nextVersion: ProjectVersion = {
      id: crypto.randomUUID(),
      title: projectTitle,
      prompt,
      template: selectedTemplate,
      savedAt: new Date().toISOString(),
    };

    setProjectVersions((current) => [nextVersion, ...current].slice(0, 8));
  }

  function duplicateProjectSetup() {
    setProjectTitle((current) => `${current} (Copy)`);
    saveDraftVersion();
  }

  function enhancePrompt() {
    if (!prompt.trim()) {
      setPrompt(
        "Create a high-converting 30-second ad with an engaging hook, clear value proposition, social proof, and direct call to action.",
      );
      return;
    }

    setPrompt(
      `${prompt.trim()} Focus on a confident opening hook, concise scene pacing, and a clear conversion-focused call to action at the end.`,
    );
  }

  useEffect(() => {
    if (!jobId || !session?.access_token) {
      return;
    }

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/video/status?jobId=${encodeURIComponent(jobId)}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = (await response.json()) as {
          status?: string;
          videoUrl?: string | null;
          error?: string;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to fetch job status.");
        }

        setJobStatus(data.status ?? null);
        setVideoUrl(data.videoUrl ?? null);

        if (data.status === "complete" || data.status === "failed") {
          window.clearInterval(intervalId);
        }
      } catch (pollError) {
        if (!cancelled) {
          setError(pollError instanceof Error ? pollError.message : "Failed to fetch job status.");
        }
      }
    };

    void pollStatus();
    const intervalId = window.setInterval(() => {
      void pollStatus();
    }, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [jobId, session?.access_token]);

  useEffect(() => {
    if (!isProcessing) {
      return;
    }

    const id = window.setInterval(() => {
      setProgressValue((current) => {
        if (current >= 96) return 96;
        const step = current < 60 ? 8 : current < 85 ? 4 : 2;
        return Math.min(96, current + step);
      });

      setEtaMinutes((value) => {
        if (value === null || value <= 1) return 1;
        return value - 1;
      });
    }, 2500);

    return () => window.clearInterval(id);
  }, [isProcessing]);

  useEffect(() => {
    if (avatar && avatar.startsWith("avatar-")) {
      setSelectedAvatar(avatar as VideoAvatarId);
    }
  }, [avatar]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ProjectVersion[];
      if (Array.isArray(parsed)) {
        setProjectVersions(parsed.slice(0, 8));
      }
    } catch {
      setProjectVersions([]);
    }
  }, [draftStorageKey]);

  useEffect(() => {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(projectVersions));
  }, [draftStorageKey, projectVersions]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        const form = document.getElementById("create-video-form") as HTMLFormElement | null;
        form?.requestSubmit();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!session?.access_token) {
      setError("Please sign in again before creating a video.");
      return;
    }

    if (!prompt.trim()) {
      setError("Enter a prompt first.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          avatarKey: selectedAvatar,
        }),
      });

      const data = (await response.json()) as {
        id?: string;
        error?: string;
      };

      if (!response.ok || !data.id) {
        throw new Error(data.error ?? "Failed to create video job.");
      }

      setJobId(data.id);
      setJobStatus("processing");
      setVideoUrl(null);
      setProgressValue(12);
      setQueuePosition(Math.ceil(Math.random() * 4));
      setEtaMinutes(6);
      setPrompt("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create video job.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-950">Loading your workspace…</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            We’re checking your session and preparing the video builder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[70vh] max-w-3xl px-6 py-16">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95 shadow-[0_18px_70px_-42px_rgba(15,23,42,0.35)]">
        <CardHeader className="space-y-3 pb-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Create video
          </div>
          <CardTitle className="font-display text-[2rem] leading-tight text-slate-950 sm:text-[2.25rem]">
            Turn one prompt into a polished video
          </CardTitle>
          <CardDescription className="max-w-2xl text-base leading-7 text-slate-600">
            Write what you want to make, choose an avatar, and queue the render. The generation
            pipeline will handle the rest.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="create-video-form" className="space-y-5" onSubmit={handleSubmit}>
            {showOnboardingTip && (
              <div className="rounded-[1.25rem] border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-2 font-medium">
                    <Lightbulb className="h-4 w-4" />
                    Pro tip: use Ctrl/Cmd + Enter to start generation quickly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowOnboardingTip(false)}
                    className="rounded-full border border-cyan-300 bg-white px-3 py-1 text-xs font-semibold text-cyan-800 hover:bg-cyan-100"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-800">Project title</span>
                <input
                  value={projectTitle}
                  onChange={(event) => setProjectTitle(event.target.value)}
                  placeholder="e.g. Summer campaign launch"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                />
              </label>
              <SelectCard
                label="Category"
                value={projectCategory}
                onChange={setProjectCategory}
                options={projectCategoryOptions}
                icon={<LayoutTemplate className="h-4 w-4" />}
              />
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-800">Prompt</span>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={6}
                placeholder="Describe the video you want to create in a few clear sentences"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white"
              />
            </label>

            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  AI prompt suggestions
                </p>
                <button
                  type="button"
                  onClick={enhancePrompt}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Enhance prompt
                </button>
              </div>
              <div className="mt-3 grid gap-2">
                {promptSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setPrompt(suggestion)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm leading-6 text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  AI creative assistant
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => enhancePrompt()}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Improve prompt
                  </button>
                  <button
                    type="button"
                    onClick={() => createScriptFromPrompt(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Create script
                  </button>
                  <button
                    type="button"
                    onClick={() => createScenePlanFromPrompt(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Plan scenes
                  </button>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                {assistantIdeas.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setPrompt(idea)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm leading-6 text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <SelectCard
                label="Style"
                value={selectedStyle}
                onChange={setSelectedStyle}
                options={styleOptions}
                icon={<Wand2 className="h-4 w-4" />}
              />
              <SelectCard
                label="Resolution"
                value={selectedResolution}
                onChange={setSelectedResolution}
                options={resolutionOptions}
                icon={<Video className="h-4 w-4" />}
              />
              <SelectCard
                label="Duration"
                value={selectedDuration}
                onChange={setSelectedDuration}
                options={durationOptions}
                icon={<Timer className="h-4 w-4" />}
              />
              <SelectCard
                label="Aspect ratio"
                value={selectedAspectRatio}
                onChange={setSelectedAspectRatio}
                options={aspectRatioOptions}
                icon={<Ratio className="h-4 w-4" />}
              />
              <SelectCard
                label="Camera movement"
                value={selectedCamera}
                onChange={setSelectedCamera}
                options={cameraOptions}
                icon={<Gauge className="h-4 w-4" />}
              />
              <SelectCard
                label="Voice"
                value={selectedVoice}
                onChange={setSelectedVoice}
                options={voiceOptions}
                icon={<Mic2 className="h-4 w-4" />}
              />
            </div>

            <SelectCard
              label="Template"
              value={selectedTemplate}
              onChange={setSelectedTemplate}
              options={templateOptions}
              icon={<Layers3 className="h-4 w-4" />}
            />

            <SelectCard
              label="Export format"
              value={selectedFormat}
              onChange={setSelectedFormat}
              options={formatOptions}
              icon={<Video className="h-4 w-4" />}
            />

            <label className="block space-y-2">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <ScrollText className="h-4 w-4" />
                Script assistant
              </span>
              <textarea
                value={scriptDraft}
                onChange={(event) => setScriptDraft(event.target.value)}
                rows={5}
                placeholder="Generate or write a script draft for your avatar voiceover"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white"
              />
            </label>

            {scenePlan.length > 0 && (
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Clapperboard className="h-4 w-4" />
                  Storyboard and scene plan
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {scenePlan.map((scene) => (
                    <div
                      key={scene.scene}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      <p className="font-semibold text-slate-900">
                        Scene {scene.scene} · {scene.duration}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                        {scene.objective}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {scene.visualDirection}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Choose an AI avatar</p>
                <p className="text-sm leading-6 text-slate-600">
                  Pick the presenter that best matches the tone, audience, and pace of your video.
                </p>
              </div>
              <AvatarGallery value={selectedAvatar} onChange={setSelectedAvatar} />
            </div>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting || !session?.access_token}
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                title="Ctrl/Cmd + Enter"
              >
                {submitting ? "Creating video…" : "Create video"}
              </button>
              <button
                type="button"
                onClick={saveDraftVersion}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <Save className="h-4 w-4" />
                Save draft
              </button>
              <button
                type="button"
                onClick={duplicateProjectSetup}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => setFavoriteProject((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition ${
                  {
                    true: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
                    false:
                      "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50",
                  }[String(favoriteProject) as "true" | "false"]
                }`}
              >
                <Heart className={`h-4 w-4 ${favoriteProject ? "fill-current" : ""}`} />
                {favoriteProject ? "Favorited" : "Add favorite"}
              </button>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/dashboard" })}
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Back to dashboard
              </button>
            </div>

            {isProcessing && (
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)]">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                        Creating your AI video...
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Your project is being rendered with live stage tracking while you continue
                        working.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-slate-950 via-sky-600 to-cyan-400 transition-[width] duration-500"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                      <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                        <p>Progress: {progressValue}%</p>
                        <p>Queue position: {queuePosition ?? "-"}</p>
                        <p>ETA: {etaMinutes ?? "-"} min</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                        Stage: prompt analysis complete
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                        Stage: avatar + voice synthesis
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                        Stage: final composition and export
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setJobStatus(null);
                        setJobId(null);
                        setProgressValue(8);
                      }}
                      className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 hover:text-slate-900"
                    >
                      Cancel tracking
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showResult && !isProcessing && (
              <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 shadow-[0_12px_40px_-24px_rgba(16,185,129,0.45)]">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Video ready
                      </p>
                      <p className="mt-2 text-sm leading-6 text-emerald-950/80">
                        Your video has finished generating. Preview it below or open the direct link
                        in a new tab.
                      </p>
                    </div>

                    {videoUrl && (
                      <div className="space-y-3">
                        <video
                          controls
                          src={videoUrl}
                          className="w-full rounded-2xl border border-emerald-200 bg-black shadow-sm"
                        />
                        <a
                          className="inline-flex break-all text-sm font-medium text-emerald-800 underline underline-offset-4"
                          href={videoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open generated video
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showResult && !videoUrl && !isProcessing && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                Your video is ready. If the preview is still loading, the direct link will appear
                shortly.
              </div>
            )}

            {projectVersions.length > 0 && (
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Version history</p>
                <div className="mt-3 space-y-2">
                  {projectVersions.map((version) => (
                    <button
                      key={version.id}
                      type="button"
                      onClick={() => {
                        setProjectTitle(version.title);
                        setPrompt(version.prompt);
                        setSelectedTemplate(version.template);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300"
                    >
                      <p className="font-semibold text-slate-900">{version.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(version.savedAt).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SelectCard({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  icon: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
        {icon}
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
