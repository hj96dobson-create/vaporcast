import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Bot,
  CirclePlay,
  Clock3,
  Heart,
  Languages,
  LoaderCircle,
  Mic2,
  SendHorizontal,
  Sparkles,
  Star,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/hooks/useSession";
import { supabase, supabaseClientReady } from "@/integrations/supabase/client";
import { defaultVideoAvatarId, type VideoAvatarId, videoAvatars } from "@/lib/video-avatars";
import { cn } from "@/lib/utils";

type AvatarHistoryRow = {
  id: string;
  avatar_key: VideoAvatarId;
  voice: string;
  language: string;
  personality: string;
  style: string;
  emotion: string;
  background: string;
  script: string;
  source: string;
  created_at: string;
};

type AvatarProjectRow = {
  id: string;
  title: string;
  avatar_key: VideoAvatarId;
  voice: string;
  language: string;
  style: string;
  emotion: string;
  background: string;
  script: string;
  status: string;
  video_job_id: string | null;
  created_at: string;
};

type ProviderStatus = {
  configured: boolean;
  provider: string | null;
  missing: string[];
};

type LiveSessionResponse = {
  sessionId: string;
  provider: string;
  streamUrl: string | null;
  embedUrl: string | null;
};

type StoredAvatarCollections = {
  favorites: VideoAvatarId[];
  history: AvatarHistoryRow[];
  projects: AvatarProjectRow[];
};

function getAvatarCollectionsKey(userId: string) {
  return `vaporcast-avatar-collections:${userId}`;
}

function readLocalAvatarCollections(userId: string): StoredAvatarCollections {
  if (typeof window === "undefined") {
    return { favorites: [], history: [], projects: [] };
  }

  const rawValue = window.localStorage.getItem(getAvatarCollectionsKey(userId));
  if (!rawValue) {
    return { favorites: [], history: [], projects: [] };
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<StoredAvatarCollections>;
    return {
      favorites: Array.isArray(parsed.favorites) ? (parsed.favorites as VideoAvatarId[]) : [],
      history: Array.isArray(parsed.history) ? (parsed.history as AvatarHistoryRow[]) : [],
      projects: Array.isArray(parsed.projects) ? (parsed.projects as AvatarProjectRow[]) : [],
    };
  } catch {
    return { favorites: [], history: [], projects: [] };
  }
}

function writeLocalAvatarCollections(userId: string, collections: StoredAvatarCollections) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getAvatarCollectionsKey(userId), JSON.stringify(collections));
}

export function LiveAvatarStudio() {
  const router = useRouter();
  const { session } = useSession();
  const localVoiceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [selectedAvatar, setSelectedAvatar] = useState<VideoAvatarId>(defaultVideoAvatarId);
  const [selectedVoice, setSelectedVoice] = useState(videoAvatars[0].voiceOptions[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(videoAvatars[0].languages[0]);
  const [selectedPersonality, setSelectedPersonality] = useState(videoAvatars[0].personality);
  const [selectedEmotion, setSelectedEmotion] = useState("Confident");
  const [selectedStyle, setSelectedStyle] = useState("Studio");
  const [selectedBackground, setSelectedBackground] = useState("Studio");
  const [script, setScript] = useState(
    "Introduce the offer, highlight the differentiator, and close with a single confident call to action.",
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Select an avatar to start a live session.");
  const [starting, setStarting] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ending, setEnding] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [checkingProvider, setCheckingProvider] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(true);
  const [testingSpeech, setTestingSpeech] = useState(false);
  const [favoriteAvatarIds, setFavoriteAvatarIds] = useState<VideoAvatarId[]>([]);
  const [recentHistory, setRecentHistory] = useState<AvatarHistoryRow[]>([]);
  const [savedProjects, setSavedProjects] = useState<AvatarProjectRow[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [savingFavoriteAvatarId, setSavingFavoriteAvatarId] = useState<VideoAvatarId | null>(null);
  const [avatarPersistenceMode, setAvatarPersistenceMode] = useState<"supabase" | "local">(
    "supabase",
  );

  const activeAvatar = useMemo(
    () => videoAvatars.find((avatar) => avatar.id === selectedAvatar) ?? videoAvatars[0],
    [selectedAvatar],
  );

  useEffect(() => {
    setSelectedVoice(activeAvatar.voiceOptions[0]);
    setSelectedLanguage(activeAvatar.languages[0]);
    setSelectedPersonality(activeAvatar.personality);
  }, [activeAvatar]);

  useEffect(() => {
    if (!session?.user?.id || !supabaseClientReady) return;

    let cancelled = false;
    const userId = session.user.id;

    async function loadAvatarCollections() {
      setLoadingCollections(true);

      const [favoritesResult, historyResult, projectsResult] = await Promise.all([
        supabase
          .from("avatar_favorites")
          .select("avatar_key, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("avatar_history")
          .select(
            "id, avatar_key, voice, language, personality, style, emotion, background, script, source, created_at",
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("avatar_projects")
          .select(
            "id, title, avatar_key, voice, language, style, emotion, background, script, status, video_job_id, created_at",
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      const tableMissing = [favoritesResult.error, historyResult.error, projectsResult.error].some(
        (queryError) =>
          Boolean(queryError?.message.match(/schema cache|could not find the table/i)),
      );

      if (tableMissing) {
        setAvatarPersistenceMode("local");
        const stored = readLocalAvatarCollections(userId);
        if (cancelled) return;
        setFavoriteAvatarIds(stored.favorites);
        setRecentHistory(stored.history);
        setSavedProjects(stored.projects);
        setLoadingCollections(false);
        return;
      }

      if (cancelled) return;

      if (favoritesResult.error) {
        setError(favoritesResult.error.message);
      } else {
        setFavoriteAvatarIds(
          (favoritesResult.data ?? []).map((row) => row.avatar_key as VideoAvatarId),
        );
      }

      if (historyResult.error) {
        setError(historyResult.error.message);
      } else {
        setRecentHistory((historyResult.data ?? []) as AvatarHistoryRow[]);
      }

      if (projectsResult.error) {
        setError(projectsResult.error.message);
      } else {
        setSavedProjects((projectsResult.data ?? []) as AvatarProjectRow[]);
      }

      writeLocalAvatarCollections(userId, {
        favorites: (favoritesResult.data ?? []).map((row) => row.avatar_key as VideoAvatarId),
        history: (historyResult.data ?? []) as AvatarHistoryRow[],
        projects: (projectsResult.data ?? []) as AvatarProjectRow[],
      });

      setLoadingCollections(false);
    }

    void loadAvatarCollections();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    setPreviewPlaying(true);
  }, [selectedAvatar]);

  async function refreshRecentHistory() {
    if (!session?.user?.id || !supabaseClientReady) return;

    if (avatarPersistenceMode === "local") {
      setRecentHistory(readLocalAvatarCollections(session.user.id).history);
      return;
    }

    const { data } = await supabase
      .from("avatar_history")
      .select(
        "id, avatar_key, voice, language, personality, style, emotion, background, script, source, created_at",
      )
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(8);

    setRecentHistory((data ?? []) as AvatarHistoryRow[]);
  }

  async function refreshSavedProjects() {
    if (!session?.user?.id || !supabaseClientReady) return;

    if (avatarPersistenceMode === "local") {
      setSavedProjects(readLocalAvatarCollections(session.user.id).projects);
      return;
    }

    const { data } = await supabase
      .from("avatar_projects")
      .select(
        "id, title, avatar_key, voice, language, style, emotion, background, script, status, video_job_id, created_at",
      )
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(6);

    setSavedProjects((data ?? []) as AvatarProjectRow[]);
  }

  async function saveAvatarHistory(source: string, avatarId: VideoAvatarId = selectedAvatar) {
    if (!session?.user?.id || !supabaseClientReady) return;

    if (avatarPersistenceMode === "local") {
      const stored = readLocalAvatarCollections(session.user.id);
      const nextHistory: AvatarHistoryRow[] = [
        {
          id: crypto.randomUUID(),
          avatar_key: avatarId,
          voice: selectedVoice,
          language: selectedLanguage,
          personality: selectedPersonality,
          style: selectedStyle,
          emotion: selectedEmotion,
          background: selectedBackground,
          script: script.trim(),
          source,
          created_at: new Date().toISOString(),
        },
        ...stored.history,
      ].slice(0, 8);

      writeLocalAvatarCollections(session.user.id, {
        ...stored,
        history: nextHistory,
      });
      setRecentHistory(nextHistory);
      return;
    }

    const { error: insertError } = await supabase.from("avatar_history").insert({
      user_id: session.user.id,
      avatar_key: avatarId,
      voice: selectedVoice,
      language: selectedLanguage,
      personality: selectedPersonality,
      style: selectedStyle,
      emotion: selectedEmotion,
      background: selectedBackground,
      script: script.trim(),
      source,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    await refreshRecentHistory();
  }

  async function saveCurrentSetup() {
    if (!session?.user?.id || !supabaseClientReady) {
      setError("Sign in is required to save projects.");
      return;
    }

    if (avatarPersistenceMode === "local") {
      const stored = readLocalAvatarCollections(session.user.id);
      const nextProject: AvatarProjectRow = {
        id: crypto.randomUUID(),
        title: `${activeAvatar.name} - ${selectedStyle} ${selectedEmotion}`,
        avatar_key: selectedAvatar,
        voice: selectedVoice,
        language: selectedLanguage,
        style: selectedStyle,
        emotion: selectedEmotion,
        background: selectedBackground,
        script: script.trim(),
        status: "draft",
        video_job_id: null,
        created_at: new Date().toISOString(),
      };

      const nextProjects = [nextProject, ...stored.projects].slice(0, 6);
      writeLocalAvatarCollections(session.user.id, {
        ...stored,
        projects: nextProjects,
      });
      setSavedProjects(nextProjects);
      await saveAvatarHistory("saved-project");
      return;
    }

    const { error: insertError } = await supabase.from("avatar_projects").insert({
      user_id: session.user.id,
      title: `${activeAvatar.name} - ${selectedStyle} ${selectedEmotion}`,
      avatar_key: selectedAvatar,
      voice: selectedVoice,
      language: selectedLanguage,
      style: selectedStyle,
      emotion: selectedEmotion,
      background: selectedBackground,
      script: script.trim(),
      status: "draft",
      video_job_id: null,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    await refreshSavedProjects();
    await saveAvatarHistory("saved-project");
  }

  async function toggleFavoriteAvatar(avatarId: VideoAvatarId) {
    if (!session?.user?.id || !supabaseClientReady) {
      setError("Sign in is required to save favorites.");
      return;
    }

    if (avatarPersistenceMode === "local") {
      const stored = readLocalAvatarCollections(session.user.id);
      const isFavorite = stored.favorites.includes(avatarId);
      const nextFavorites = isFavorite
        ? stored.favorites.filter((id) => id !== avatarId)
        : [avatarId, ...stored.favorites.filter((id) => id !== avatarId)];

      writeLocalAvatarCollections(session.user.id, {
        ...stored,
        favorites: nextFavorites,
      });
      setFavoriteAvatarIds(nextFavorites);
      return;
    }

    setSavingFavoriteAvatarId(avatarId);
    setError(null);

    const isFavorite = favoriteAvatarIds.includes(avatarId);
    if (isFavorite) {
      const { error: deleteError } = await supabase
        .from("avatar_favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("avatar_key", avatarId);

      if (deleteError) {
        setError(deleteError.message);
      } else {
        setFavoriteAvatarIds((current) => current.filter((id) => id !== avatarId));
      }

      setSavingFavoriteAvatarId(null);
      return;
    }

    const { error: insertError } = await supabase.from("avatar_favorites").insert({
      user_id: session.user.id,
      avatar_key: avatarId,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setFavoriteAvatarIds((current) => [avatarId, ...current.filter((id) => id !== avatarId)]);
    }

    setSavingFavoriteAvatarId(null);
  }

  async function handleSelectAvatar(avatarId: VideoAvatarId) {
    setSelectedAvatar(avatarId);
    setStatus(
      `Selected ${videoAvatars.find((avatar) => avatar.id === avatarId)?.name ?? avatarId}. Preview updated.`,
    );
    await saveAvatarHistory("selected", avatarId);
  }

  useEffect(() => {
    if (!jobId || !session?.access_token) return;

    let cancelled = false;
    const intervalId = window.setInterval(async () => {
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
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to read video status.");
        }

        if (cancelled) return;

        const nextStatus = data.status ?? null;
        setJobStatus(nextStatus);
        setVideoUrl(data.videoUrl ?? null);
        if (nextStatus === "complete" || nextStatus === "failed") {
          window.clearInterval(intervalId);
        }
      } catch (pollError) {
        if (!cancelled) {
          setError(pollError instanceof Error ? pollError.message : "Status polling failed.");
        }
      }
    }, 2800);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [jobId, session?.access_token]);

  async function checkProviderStatus() {
    if (!session?.access_token) return;

    setCheckingProvider(true);
    try {
      const response = await fetch("/api/avatar/provider/status", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = (await response.json()) as ProviderStatus & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to read provider status.");
      }

      setProviderStatus(data);
      if (data.provider === "mock") {
        setStatus(
          "Mock avatar mode active. Live sessions run locally without external provider keys.",
        );
      } else if (!data.configured) {
        setStatus("Provider is not configured yet. Add env vars and retry.");
      }
    } catch (statusError) {
      setError(
        statusError instanceof Error ? statusError.message : "Provider status check failed.",
      );
    } finally {
      setCheckingProvider(false);
    }
  }

  useEffect(() => {
    void checkProviderStatus();
  }, [session?.access_token]);

  async function startLiveSession() {
    if (!session?.access_token) {
      setError("Sign in is required before starting live avatar streaming.");
      return;
    }

    setError(null);
    setStarting(true);
    setStatus("Starting live avatar session...");

    try {
      const response = await fetch("/api/avatar/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          avatarId: selectedAvatar,
          voice: selectedVoice,
          language: selectedLanguage,
          personality: selectedPersonality,
          style: selectedStyle,
          background: selectedBackground,
        }),
      });

      const data = (await response.json()) as LiveSessionResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to start live avatar session.");
      }

      setSessionId(data.sessionId);
      setProvider(data.provider);
      setStreamUrl(data.streamUrl);
      setEmbedUrl(data.embedUrl);
      setStatus("Live avatar stream ready.");
      void saveAvatarHistory("live-session-started");
    } catch (startError) {
      setSessionId(null);
      setProvider(null);
      setStreamUrl(null);
      setEmbedUrl(null);
      setStatus("Live session unavailable.");
      if (startError instanceof Error && /provider|table|schema cache/i.test(startError.message)) {
        setStatus("Live session running in local preview mode.");
      } else {
        setError(
          startError instanceof Error ? startError.message : "Unable to start live session.",
        );
      }
    } finally {
      setStarting(false);
    }
  }

  async function sendSpeech() {
    if (!session?.access_token || !sessionId) {
      setError("Start a live avatar session first.");
      return;
    }

    if (!script.trim()) {
      setError("Enter script text before speaking.");
      return;
    }

    setError(null);
    setSpeaking(true);
    setStatus("Streaming speech to avatar...");

    try {
      const response = await fetch("/api/avatar/session/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          sessionId,
          text: script.trim(),
          emotion: selectedEmotion,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Avatar speech failed.");
      }

      setStatus("Speech task sent. Avatar should now talk with lip sync from provider stream.");
      void saveAvatarHistory("speech-sent");
    } catch (speakError) {
      setError(speakError instanceof Error ? speakError.message : "Speech task failed.");
      setStatus("Speech failed.");
    } finally {
      setSpeaking(false);
    }
  }

  async function stopLiveSession() {
    if (!session?.access_token || !sessionId) return;

    setEnding(true);
    setError(null);

    try {
      const response = await fetch("/api/avatar/session/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to end live session.");
      }

      setSessionId(null);
      setProvider(null);
      setStreamUrl(null);
      setEmbedUrl(null);
      setStatus("Live session ended.");
      void saveAvatarHistory("live-session-ended");
    } catch (endError) {
      setError(endError instanceof Error ? endError.message : "Unable to end session.");
    } finally {
      setEnding(false);
    }
  }

  async function generatePresenterVideo() {
    if (!session?.access_token) {
      setError("Sign in is required to generate presenter videos.");
      return;
    }

    setGenerating(true);
    setError(null);
    setStatus("Creating presenter video job...");

    try {
      const prompt = [
        `Presenter category: ${activeAvatar.category}`,
        `Presenter role: ${activeAvatar.role}`,
        `Personality: ${selectedPersonality}`,
        `Emotion: ${selectedEmotion}`,
        `Style: ${selectedStyle}`,
        `Background: ${selectedBackground}`,
        `Language: ${selectedLanguage}`,
        `Script: ${script.trim()}`,
      ].join("\n");

      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt,
          avatarKey: selectedAvatar,
        }),
      });

      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) {
        throw new Error(data.error ?? "Presenter video generation failed.");
      }

      setJobId(data.id);
      setJobStatus("processing");
      setVideoUrl(null);
      setStatus("Presenter video generation started.");

      if (session?.user?.id && supabaseClientReady && avatarPersistenceMode !== "local") {
        const { error: insertError } = await supabase.from("avatar_projects").insert({
          user_id: session.user.id,
          title: `${activeAvatar.name} - ${selectedStyle} ${selectedEmotion}`,
          avatar_key: selectedAvatar,
          voice: selectedVoice,
          language: selectedLanguage,
          style: selectedStyle,
          emotion: selectedEmotion,
          background: selectedBackground,
          script: script.trim(),
          status: "processing",
          video_job_id: data.id,
        });

        if (!insertError) {
          await refreshSavedProjects();
        }
      } else if (session?.user?.id) {
        await saveCurrentSetup();
      }

      void saveAvatarHistory("video-generated");
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "Video generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  function togglePreviewPlayback() {
    setPreviewPlaying((current) => !current);
  }

  function runSpeechTest() {
    if (sessionId) {
      void sendSpeech();
      return;
    }

    if (!("speechSynthesis" in window)) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    const text = script.trim();
    if (!text) {
      setError("Enter script text before testing speech.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.rate = 1;
    utterance.pitch = selectedEmotion === "Excited" ? 1.2 : selectedEmotion === "Calm" ? 0.9 : 1;
    utterance.onstart = () => {
      setTestingSpeech(true);
      setStatus("Running local voice preview. Start live session for provider lip-sync.");
    };
    utterance.onend = () => setTestingSpeech(false);
    utterance.onerror = () => {
      setTestingSpeech(false);
      setError("Local speech test failed.");
    };
    localVoiceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.35fr_0.9fr]">
      <Card className="order-2 border-white/70 bg-white/85 shadow-[0_22px_80px_-45px_rgba(15,23,42,0.5)] backdrop-blur xl:order-1">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-slate-950">Avatar library</CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-600">
            Pick a presenter, mark favorites, and keep the studio state tied to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {videoAvatars.map((avatar) => {
              const selected = avatar.id === selectedAvatar;
              const favorite = favoriteAvatarIds.includes(avatar.id);

              return (
                <div
                  key={avatar.id}
                  onClick={() => void handleSelectAvatar(avatar.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      void handleSelectAvatar(avatar.id);
                    }
                  }}
                  className={cn(
                    "group relative flex w-full items-start gap-3 overflow-hidden rounded-[1.4rem] border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                    selected
                      ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                >
                  <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={avatar.previewClipUrl}
                      alt={avatar.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{avatar.name}</p>
                        <p
                          className={cn(
                            "text-xs uppercase tracking-[0.18em]",
                            selected ? "text-white/70" : "text-slate-500",
                          )}
                        >
                          {avatar.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
                            selected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
                          )}
                        >
                          {avatar.category}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
                            favorite ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {favorite ? "Saved" : "Fresh"}
                        </span>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-sm leading-6",
                        selected ? "text-white/80" : "text-slate-600",
                      )}
                    >
                      {avatar.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.16em]">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1",
                          selected ? "bg-white/15 text-white" : "bg-cyan-50 text-cyan-700",
                        )}
                      >
                        {avatar.personality}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1",
                          selected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {avatar.voiceOptions[0]}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      void toggleFavoriteAvatar(avatar.id);
                    }}
                    disabled={savingFavoriteAvatarId === avatar.id}
                    className={cn(
                      "absolute right-3 top-3 h-9 w-9 rounded-full border backdrop-blur transition",
                      favorite
                        ? "border-amber-200 bg-amber-500 text-white hover:bg-amber-400"
                        : "border-slate-200 bg-white/90 text-slate-500 hover:text-slate-950",
                    )}
                  >
                    {savingFavoriteAvatarId === avatar.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Favorites
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {favoriteAvatarIds.length}
              </p>
              <p className="text-sm text-slate-600">Saved across your workspace.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Recent edits
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{recentHistory.length}</p>
              <p className="text-sm text-slate-600">Tracked when you switch or generate.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Projects
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{savedProjects.length}</p>
              <p className="text-sm text-slate-600">Saved presenter setups.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="order-1 overflow-hidden border-white/70 bg-white/85 shadow-[0_22px_80px_-45px_rgba(15,23,42,0.5)] backdrop-blur xl:order-2">
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white shadow-glow">
            <Bot className="h-3.5 w-3.5 text-cyan-300" />
            Live human presenter
          </div>
          <CardTitle className="font-display text-[1.8rem] text-slate-950">
            Live stream preview
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-600">
            Real provider stream with TTS and lip-sync orchestration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(167,139,250,0.3),transparent_42%),linear-gradient(130deg,#0f172a,#1e293b)] p-2">
            <div className="aspect-[16/10] min-h-[250px] overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/40 sm:min-h-[340px] xl:min-h-[420px]">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Live avatar stream"
                  className="h-full w-full"
                  allow="camera; microphone; autoplay; fullscreen"
                />
              ) : streamUrl ? (
                <video
                  src={streamUrl}
                  autoPlay
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={activeAvatar.previewClipUrl}
                  alt={activeAvatar.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {provider ? `${provider.toUpperCase()} stream` : "Preview mode"}
            </div>
            {!provider && (
              <div className="absolute right-4 top-4 rounded-full border border-cyan-200/40 bg-cyan-500/25 px-3 py-1 text-xs font-medium text-cyan-50 backdrop-blur">
                Animated preview
              </div>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button onClick={togglePreviewPlayback} variant="outline" className="w-full rounded-xl">
              <CirclePlay className="h-4 w-4" />
              {previewPlaying ? "Pause preview" : "Play preview"}
            </Button>
            <Button
              onClick={runSpeechTest}
              disabled={testingSpeech || speaking}
              variant="outline"
              className="w-full rounded-xl"
            >
              <SendHorizontal className="h-4 w-4" />
              {testingSpeech || speaking ? "Testing speech..." : "Test speech"}
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {error ?? status}
          </div>

          {providerStatus && !providerStatus.configured && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-semibold">Live provider not ready</p>
              <p className="mt-1">
                Missing: {providerStatus.missing.join(", ")}. Set these in your environment and
                restart the app.
              </p>
            </div>
          )}

          {videoUrl && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-sm font-semibold text-emerald-800">Presenter video ready</p>
              <video
                controls
                src={videoUrl}
                className="mt-3 w-full rounded-xl border border-emerald-200 bg-black"
              />
            </div>
          )}

          {jobId && !videoUrl && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Job {jobId.slice(0, 8)}... status: {jobStatus ?? "processing"}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="order-3 border-white/70 bg-white/85 shadow-[0_22px_80px_-45px_rgba(15,23,42,0.5)] backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-slate-950">Presenter controls</CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-600">
            Script, voice, emotion, style, and language controls for live and generated output.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="space-y-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Voice
            </span>
            <select
              value={selectedVoice}
              onChange={(event) => setSelectedVoice(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              {activeAvatar.voiceOptions.map((voice) => (
                <option key={voice}>{voice}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <Languages className="h-3.5 w-3.5" />
              Language
            </span>
            <select
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              {activeAvatar.languages.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Personality
            </span>
            <select
              value={selectedPersonality}
              onChange={(event) => setSelectedPersonality(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option>Professional</option>
              <option>Confident</option>
              <option>Friendly</option>
              <option>Energetic</option>
              <option>Educational</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Emotion
            </span>
            <select
              value={selectedEmotion}
              onChange={(event) => setSelectedEmotion(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option>Confident</option>
              <option>Neutral</option>
              <option>Happy</option>
              <option>Calm</option>
              <option>Excited</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Style
            </span>
            <select
              value={selectedStyle}
              onChange={(event) => setSelectedStyle(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option>Studio</option>
              <option>Marketing</option>
              <option>Education</option>
              <option>Newsroom</option>
              <option>Gaming</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Outfit
            </span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <option>Formal</option>
              <option>Business Casual</option>
              <option>Creator Casual</option>
              <option>Gaming Stream</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Background
            </span>
            <select
              value={selectedBackground}
              onChange={(event) => setSelectedBackground(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option>Studio</option>
              <option>Glass Office</option>
              <option>Neon Grid</option>
              <option>Gradient Stage</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">Script</span>
            <textarea
              value={script}
              onChange={(event) => setScript(event.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900"
            />
          </label>

          <div className="grid gap-2">
            <Button
              onClick={checkProviderStatus}
              disabled={checkingProvider}
              variant="outline"
              className="w-full rounded-xl"
            >
              {checkingProvider ? "Checking provider..." : "Check provider readiness"}
            </Button>

            <Button
              onClick={startLiveSession}
              disabled={starting}
              className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
            >
              <CirclePlay className="h-4 w-4" />
              {starting ? "Starting..." : "Start live avatar"}
            </Button>

            <Button
              onClick={sendSpeech}
              disabled={speaking || !sessionId}
              variant="outline"
              className="w-full rounded-xl"
            >
              <SendHorizontal className="h-4 w-4" />
              {speaking ? "Sending speech..." : "Speak with lip sync"}
            </Button>

            <Button
              onClick={stopLiveSession}
              disabled={ending || !sessionId}
              variant="outline"
              className="w-full rounded-xl"
            >
              <Mic2 className="h-4 w-4" />
              {ending ? "Ending..." : "End live session"}
            </Button>

            <Button
              onClick={generatePresenterVideo}
              disabled={generating}
              className="w-full rounded-xl bg-cyan-600 text-white hover:bg-cyan-500"
            >
              <Video className="h-4 w-4" />
              {generating ? "Generating..." : "Generate presenter video"}
            </Button>

            <Button
              onClick={() => void saveCurrentSetup()}
              variant="outline"
              className="w-full rounded-xl"
            >
              <Star className="h-4 w-4" />
              Save current setup
            </Button>

            <Button
              onClick={() =>
                router.navigate({ to: "/dashboard/create", search: { avatar: selectedAvatar } })
              }
              variant="outline"
              className="w-full rounded-xl"
            >
              <Sparkles className="h-4 w-4" />
              Open full create workflow
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              Recently used
            </div>
            <div className="space-y-2">
              {loadingCollections ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Loading avatar activity...
                </div>
              ) : recentHistory.length ? (
                recentHistory.map((item) => {
                  const avatar = videoAvatars.find((entry) => entry.id === item.avatar_key);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => void handleSelectAvatar(item.avatar_key)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {avatar?.name ?? item.avatar_key}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.source} · {item.created_at.slice(0, 10)}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                          {item.style}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  No avatar history yet. Select a card or generate a session to create the first
                  entry.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <Star className="h-3.5 w-3.5" />
              Saved projects
            </div>
            <div className="space-y-2">
              {savedProjects.length ? (
                savedProjects.map((project) => {
                  const avatar = videoAvatars.find((entry) => entry.id === project.avatar_key);

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => void handleSelectAvatar(project.avatar_key)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{project.title}</p>
                          <p className="text-xs text-slate-500">
                            {avatar?.name ?? project.avatar_key} · {project.status}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                          {project.voice}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  No saved projects yet. Use Save current setup after tuning an avatar.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
