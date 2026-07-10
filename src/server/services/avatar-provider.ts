export type StartAvatarSessionInput = {
  avatarProviderId: string;
  voice: string;
  language: string;
  personality: string;
  style: string;
  background: string;
};

export type StartAvatarSessionResult = {
  provider: "heygen" | "tavus" | "mock";
  sessionId: string;
  streamUrl?: string;
  embedUrl?: string;
};

export type SpeakAvatarInput = {
  sessionId: string;
  text: string;
  emotion: string;
};

export type AvatarProviderStatus = {
  configured: boolean;
  provider: "heygen" | "tavus" | "mock";
  missing: string[];
};

function getProvider() {
  const value = (process.env.VAPORCAST_AVATAR_PROVIDER ?? "").trim().toLowerCase();
  if (value === "heygen" || value === "tavus") {
    return value;
  }
  return "mock";
}

export function getAvatarProviderStatus(): AvatarProviderStatus {
  const provider = getProvider();

  if (provider === "mock") {
    return {
      configured: true,
      provider,
      missing: [],
    };
  }

  if (provider === "heygen") {
    const hasKey = Boolean((process.env.HEYGEN_API_KEY ?? "").trim());
    return {
      configured: hasKey,
      provider: hasKey ? provider : "mock",
      missing: hasKey ? [] : [],
    };
  }

  const hasKey = Boolean((process.env.TAVUS_API_KEY ?? "").trim());
  return {
    configured: hasKey,
    provider: hasKey ? provider : "mock",
    missing: hasKey ? [] : [],
  };
}

function createMockSessionId(input: StartAvatarSessionInput) {
  return `mock_${input.avatarProviderId}_${Date.now().toString(36)}`;
}

async function startMockSession(input: StartAvatarSessionInput): Promise<StartAvatarSessionResult> {
  return {
    provider: "mock",
    sessionId: createMockSessionId(input),
    streamUrl: undefined,
    embedUrl: undefined,
  };
}

async function speakMockSession() {
  return;
}

async function stopMockSession() {
  return;
}

async function fetchJson<T>(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const json = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error((json as { message?: string }).message ?? `Request failed: ${response.status}`);
  }
  return json;
}

async function startHeyGenSession(
  input: StartAvatarSessionInput,
): Promise<StartAvatarSessionResult> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY is not configured.");
  }

  const tokenResult = await fetchJson<{ data?: { token?: string } }>(
    "https://api.heygen.com/v1/streaming.create_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({}),
    },
  );

  const token = tokenResult.data?.token;
  if (!token) {
    throw new Error("Failed to create HeyGen streaming token.");
  }

  const sessionResult = await fetchJson<{
    data?: { session_id?: string; url?: string; access_url?: string; livekit_url?: string };
  }>("https://api.heygen.com/v1/streaming.new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      quality: "high",
      avatar_name: input.avatarProviderId,
      voice: {
        voice_id: input.voice,
      },
      version: "v2",
      language: input.language,
      knowledge: {
        personality: input.personality,
        style: input.style,
      },
      background: input.background,
    }),
  });

  const sessionId = sessionResult.data?.session_id;
  if (!sessionId) {
    throw new Error("HeyGen session start failed.");
  }

  await fetchJson<{ data?: { started?: boolean } }>("https://api.heygen.com/v1/streaming.start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

  return {
    provider: "heygen",
    sessionId,
    streamUrl: sessionResult.data?.livekit_url,
    embedUrl: sessionResult.data?.url ?? sessionResult.data?.access_url,
  };
}

async function speakHeyGen(input: SpeakAvatarInput) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY is not configured.");
  }

  await fetchJson("https://api.heygen.com/v1/streaming.task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({
      session_id: input.sessionId,
      text: input.text,
      task_type: "repeat",
      emotion: input.emotion,
    }),
  });
}

async function stopHeyGen(sessionId: string) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY is not configured.");
  }

  await fetchJson("https://api.heygen.com/v1/streaming.stop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({ session_id: sessionId }),
  });
}

async function startTavusSession(
  input: StartAvatarSessionInput,
): Promise<StartAvatarSessionResult> {
  const apiKey = process.env.TAVUS_API_KEY;
  if (!apiKey) {
    throw new Error("TAVUS_API_KEY is not configured.");
  }

  const result = await fetchJson<{
    conversation_id?: string;
    stream_url?: string;
    web_url?: string;
  }>("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      replica_id: input.avatarProviderId,
      conversational_context: `${input.personality} ${input.style}`,
      language: input.language,
      voice: input.voice,
      background: input.background,
    }),
  });

  if (!result.conversation_id) {
    throw new Error("Tavus conversation start failed.");
  }

  return {
    provider: "tavus",
    sessionId: result.conversation_id,
    streamUrl: result.stream_url,
    embedUrl: result.web_url,
  };
}

async function speakTavus(input: SpeakAvatarInput) {
  const apiKey = process.env.TAVUS_API_KEY;
  if (!apiKey) {
    throw new Error("TAVUS_API_KEY is not configured.");
  }

  await fetchJson(
    `https://tavusapi.com/v2/conversations/${encodeURIComponent(input.sessionId)}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        message: input.text,
        emotion: input.emotion,
      }),
    },
  );
}

async function stopTavus(sessionId: string) {
  const apiKey = process.env.TAVUS_API_KEY;
  if (!apiKey) {
    throw new Error("TAVUS_API_KEY is not configured.");
  }

  await fetchJson(`https://tavusapi.com/v2/conversations/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
    headers: {
      "x-api-key": apiKey,
    },
  });
}

export async function startAvatarSession(
  input: StartAvatarSessionInput,
): Promise<StartAvatarSessionResult> {
  const provider = getProvider();
  if (provider === "mock") {
    return startMockSession(input);
  }

  if (provider === "heygen") {
    const apiKey = (process.env.HEYGEN_API_KEY ?? "").trim();
    if (!apiKey) {
      return startMockSession(input);
    }

    return startHeyGenSession(input);
  }

  const apiKey = (process.env.TAVUS_API_KEY ?? "").trim();
  if (!apiKey) {
    return startMockSession(input);
  }

  return startTavusSession(input);
}

export async function speakAvatarSession(input: SpeakAvatarInput) {
  const provider = getProvider();
  if (provider === "mock") {
    await speakMockSession();
    return;
  }

  if (provider === "heygen") {
    const apiKey = (process.env.HEYGEN_API_KEY ?? "").trim();
    if (!apiKey) {
      await speakMockSession();
      return;
    }

    await speakHeyGen(input);
    return;
  }

  const apiKey = (process.env.TAVUS_API_KEY ?? "").trim();
  if (!apiKey) {
    await speakMockSession();
    return;
  }

  await speakTavus(input);
}

export async function stopAvatarSession(sessionId: string) {
  const provider = getProvider();
  if (provider === "mock") {
    await stopMockSession();
    return;
  }

  if (provider === "heygen") {
    const apiKey = (process.env.HEYGEN_API_KEY ?? "").trim();
    if (!apiKey) {
      await stopMockSession();
      return;
    }

    await stopHeyGen(sessionId);
    return;
  }

  const apiKey = (process.env.TAVUS_API_KEY ?? "").trim();
  if (!apiKey) {
    await stopMockSession();
    return;
  }

  await stopTavus(sessionId);
}
