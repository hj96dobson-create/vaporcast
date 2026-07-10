import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { scheduleVideoJobProcessing } from "@/server/api/video-worker";
import { defaultVideoAvatarId, videoAvatars } from "@/lib/video-avatars";

const schema = z.object({
  prompt: z.string().trim().min(1).max(1000),
  avatarKey: z.string().optional(),
});

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length);

  if (!token) {
    return null;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function createVideoJob({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid prompt." }, { status: 400 });
  }

  const prompt = parsed.data.prompt;
  const avatarKey = videoAvatars.some((avatar) => avatar.id === parsed.data.avatarKey)
    ? parsed.data.avatarKey
    : defaultVideoAvatarId;

  const { data, error } = await supabaseAdmin
    .from("video_jobs")
    .insert({
      user_id: user.id,
      prompt,
      avatar_key: avatarKey,
      status: "processing",
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("[video] create render failed:", error);

    return Response.json({ error: "Unable to create video render." }, { status: 500 });
  }

  const renderId = data.id;

  scheduleVideoJobProcessing(renderId);

  return Response.json({
    id: renderId,
  });
}

export async function getVideoJobStatus({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");

  if (!jobId) {
    return Response.json({ error: "Missing jobId." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("video_jobs")
    .select("id, user_id, status, video_url")
    .eq("id", jobId)
    .single();

  if (error || !data || data.user_id !== user.id) {
    console.error("[video] status lookup failed:", error);

    return Response.json({ error: "Render not found." }, { status: 404 });
  }

  return Response.json({
    status: data.status,
    videoUrl: data.video_url ?? null,
  });
}
