import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { generateRunwayVideo, getRunwayVideoStatus } from "@/server/services/runway";
import { getVideoAvatarById } from "@/lib/video-avatars";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processVideoJob(jobId: string) {
  const { data: job, error } = await supabaseAdmin
    .from("video_jobs")
    .select("status,prompt,video_url,avatar_key")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    console.error("[video-worker] render lookup failed", error);
    return;
  }

  if (job.status === "complete" || job.video_url) {
    return;
  }

  if (job.status !== "processing") {
    return;
  }

  let taskId: string;
  const avatar = getVideoAvatarById(job.avatar_key);
  const runwayPrompt = `Avatar: ${avatar.name} (${avatar.role})\n${job.prompt}`;

  try {
    taskId = await generateRunwayVideo(runwayPrompt);
  } catch (error) {
    console.error("[video-worker] runway generate failed", jobId, error);

    await supabaseAdmin
      .from("video_jobs")
      .update({
        status: "failed",
        video_url: null,
      })
      .eq("id", jobId);

    return;
  }

  const MAX_POLL_ATTEMPTS = 120;
  let attempts = 0;

  let finalStatus: "complete" | "failed" = "failed";
  let videoUrl: string | undefined;

  while (attempts < MAX_POLL_ATTEMPTS) {
    attempts++;

    try {
      const statusResult = (await getRunwayVideoStatus(taskId)) as
        | { status: "processing"; videoUrl?: string }
        | { status: "complete"; videoUrl?: string }
        | { status: "failed"; videoUrl?: string };

      if (statusResult.status === "complete") {
        if (statusResult.videoUrl) {
          finalStatus = "complete";
          videoUrl = statusResult.videoUrl;
        }

        break;
      }

      if (statusResult.status === "failed") {
        finalStatus = "failed";
        break;
      }
    } catch (error) {
      console.error("[video-worker] runway status failed", jobId, taskId, error);
    }

    if (attempts >= MAX_POLL_ATTEMPTS) {
      console.error("[video-worker] runway polling timeout", jobId, taskId);
      break;
    }

    await sleep(5000);
  }

  const { error: updateError } = await supabaseAdmin
    .from("video_jobs")
    .update({
      status: finalStatus,
      video_url: videoUrl ?? null,
    })
    .eq("id", jobId);

  if (updateError) {
    console.error("[video-worker] render update failed", jobId, updateError);
  }
}

export function scheduleVideoJobProcessing(jobId: string) {
  setTimeout(() => {
    void processVideoJob(jobId);
  }, 0);
}
