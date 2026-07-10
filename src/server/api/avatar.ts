import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getVideoAvatarById } from "@/lib/video-avatars";
import {
  getAvatarProviderStatus,
  speakAvatarSession,
  startAvatarSession,
  stopAvatarSession,
} from "@/server/services/avatar-provider";

const startSchema = z.object({
  avatarId: z.string().trim().min(1),
  voice: z.string().trim().min(1),
  language: z.string().trim().min(2),
  personality: z.string().trim().min(1),
  style: z.string().trim().min(1),
  background: z.string().trim().min(1),
});

const speakSchema = z.object({
  sessionId: z.string().trim().min(1),
  text: z.string().trim().min(1).max(1200),
  emotion: z.string().trim().min(1),
});

const endSchema = z.object({
  sessionId: z.string().trim().min(1),
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

export async function startAvatarLiveSession({ request }: { request: Request }) {
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

  const parsed = startSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid avatar session payload." }, { status: 400 });
  }

  try {
    const avatar = getVideoAvatarById(parsed.data.avatarId);
    const started = await startAvatarSession({
      avatarProviderId: avatar.providerAvatarId,
      voice: parsed.data.voice,
      language: parsed.data.language,
      personality: parsed.data.personality,
      style: parsed.data.style,
      background: parsed.data.background,
    });

    return Response.json({
      sessionId: started.sessionId,
      provider: started.provider,
      streamUrl: started.streamUrl ?? null,
      embedUrl: started.embedUrl ?? null,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to start avatar live session.",
      },
      { status: 500 },
    );
  }
}

export async function speakAvatarLiveSession({ request }: { request: Request }) {
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

  const parsed = speakSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid speech payload." }, { status: 400 });
  }

  try {
    await speakAvatarSession({
      sessionId: parsed.data.sessionId,
      text: parsed.data.text,
      emotion: parsed.data.emotion,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to stream speech.",
      },
      { status: 500 },
    );
  }
}

export async function endAvatarLiveSession({ request }: { request: Request }) {
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

  const parsed = endSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid end-session payload." }, { status: 400 });
  }

  try {
    await stopAvatarSession(parsed.data.sessionId);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to end avatar session.",
      },
      { status: 500 },
    );
  }
}

export async function getAvatarProviderReadiness({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const status = getAvatarProviderStatus();
  return Response.json(status);
}
