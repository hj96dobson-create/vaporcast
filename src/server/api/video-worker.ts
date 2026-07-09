import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { generateRunwayVideo, getRunwayVideoStatus } from "@/server/services/runway";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processVideoJob(jobId: string) {
  const { data: job, error } = await supabaseAdmin
    .from("video_jobs")
    .select("status,prompt,video_url")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return;
  }

  if (job.status === "complete" || job.video_url) {
    return;
  }

  if (job.status !== "processing") {
    return;
  }

  let taskId: string;
  try {
    taskId = await generateRunwayVideo(job.prompt);
  } catch (error) {
    console.error("[video-worker] runway generate failed", jobId, error);
    await supabaseAdmin
      .from("video_jobs")
      .update({ status: "failed", video_url: null })
      .eq("id", jobId);
    return;
  }

  const MAX_POLL_ATTEMPTS = 120;
  let attempts = 0;
  let finalStatus: "complete" | "failed" = "failed";
  let videoUrl: string | undefined;

  while (attempts < MAX_POLL_ATTEMPTS) {
    attempts += 1;

    try {
      const statusResult = await getRunwayVideoStatus(taskId);
      if (statusResult.status === "complete") {
        if (statusResult.videoUrl) {
          finalStatus = "complete";
          videoUrl = statusResult.videoUrl;
        } else {
          console.error(
            "[video-worker] runway succeeded without a video URL",
            jobId,
            taskId,
            statusResult.raw,
          );
          finalStatus = "failed";
        }
        break;
      }

      if (statusResult.status === "failed") {
        finalStatus = "failed";
        break;
      }
    } catch (error) {
      console.error("[video-worker] runway status fetch failed", jobId, taskId, error);
    }

    if (attempts >= MAX_POLL_ATTEMPTS) {
      console.error("[video-worker] runway polling timed out", jobId, taskId, attempts);
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
    console.error("[video-worker] failed to update job", jobId, updateError);
  }
}

export function scheduleVideoJobProcessing(jobId: string) {
  setTimeout(() => {
    void processVideoJob(jobId);
  }, 0);
}
