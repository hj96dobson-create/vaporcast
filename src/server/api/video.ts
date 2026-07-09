import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { scheduleVideoJobProcessing } from "@/server/api/video-worker";

const schema = z.object({
  prompt: z.string().trim().min(1).max(1000),
});

export async function createVideoJob({ request }: { request: Request }) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().formErrors.join(" ") || "Invalid prompt." },
      { status: 400 },
    );
  }

  const prompt = parsed.data.prompt;
  const { data, error } = await supabaseAdmin
    .from("video_jobs")
    .insert({ prompt, status: "processing" })
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("[video] create job failed", error);
    return Response.json({ error: "Unable to create video job." }, { status: 500 });
  }

  const jobId = data.id;
  scheduleVideoJobProcessing(jobId);

  return Response.json({ jobId });
}

export async function getVideoJobStatus({ request }: { request: Request }) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) {
    return Response.json({ error: "Missing jobId." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("video_jobs")
    .select("status, video_url")
    .eq("id", jobId)
    .single();

  if (error || !data) {
    return Response.json({ error: "Job not found." }, { status: 404 });
  }

  return Response.json({
    status: data.status === "complete" ? "complete" : "processing",
    videoUrl: data.video_url ?? undefined,
  });
}
