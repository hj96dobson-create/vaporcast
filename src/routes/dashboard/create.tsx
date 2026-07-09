import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useUserProfile } from "@/hooks/useUserProfile";

export const Route = createFileRoute("/dashboard/create")({
  component: CreateVideo,
});

function CreateVideo() {
  const { user, loading } = useSession();
  const { profile } = useUserProfile();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "processing" | "success" | "error">(
    "idle",
  );
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.navigate({ to: "/auth" });
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!jobId || !isPolling) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/video/status?jobId=${encodeURIComponent(jobId)}`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (data.status === "complete") {
          setStatus("success");
          setVideoUrl(data.videoUrl ?? null);
          setInfoMessage("Video ready.");
          setIsPolling(false);
          clearInterval(interval);
          return;
        }

        setStatus("processing");
        setInfoMessage("Generating video...");
      } catch {
        setStatus("error");
        setInfoMessage("Unable to poll video status.");
        setIsPolling(false);
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [jobId, isPolling]);

  if (loading) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Opening create studio</h1>
          <p className="mt-2 text-sm text-slate-600">
            Checking your session and preparing the editor.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }

    setStatus("loading");
    setInfoMessage(null);
    setJobId(null);
    setVideoUrl(null);
    setIsPolling(false);

    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: "Unknown error" }));
        setStatus("error");
        setInfoMessage(errorBody.error ?? "Failed to create video job.");
        return;
      }

      const data = await response.json();
      const returnedJobId = data.jobId ?? null;
      setJobId(returnedJobId);
      setStatus("processing");
      setInfoMessage("Video job created. Checking status...");
      setIsPolling(true);
    } catch (error) {
      setStatus("error");
      setInfoMessage("Unable to call the video generation API.");
    }
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-950">Create a new video render</h1>
            <p className="mt-3 text-slate-600">
              Use the dashboard create page to build your prompt and prepare a render job. This page
              is fully functional as a session-protected UI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-700">
                Video prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={6}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Describe the video idea you want to create..."
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="font-medium text-slate-900">
                  {profile?.username ?? user.email ?? user.id}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!prompt.trim() || status === "loading"}
                >
                  {status === "loading" ? "Generating video..." : "Generate video"}
                </button>

                <button
                  type="button"
                  onClick={() => router.navigate({ to: "/dashboard" })}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Back to dashboard
                </button>
              </div>
            </div>
          </form>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
            {infoMessage ? (
              <div>{infoMessage}</div>
            ) : (
              <div>Enter a prompt and submit to create a video job.</div>
            )}
            {jobId ? <div className="mt-2 font-medium text-slate-900">Job ID: {jobId}</div> : null}
            {videoUrl ? (
              <div className="mt-2 text-slate-700">
                Video URL:{" "}
                <a className="text-slate-900 underline" href={videoUrl}>
                  {videoUrl}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
