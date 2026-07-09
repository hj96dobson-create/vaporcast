const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;
const RUNWAY_API_BASE = "https://api.runwayml.com/v1";

if (!RUNWAY_API_KEY) {
  throw new Error("Missing RUNWAY_API_KEY environment variable for Runway service.");
}

function getRunwayHeaders() {
  return {
    Authorization: `Bearer ${RUNWAY_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function generateRunwayVideo(prompt: string) {
  const response = await fetch(`${RUNWAY_API_BASE}/image_to_video`, {
    method: "POST",
    headers: getRunwayHeaders(),
    body: JSON.stringify({
      prompt,
      model: "gen3a_turbo",
      ratio: "9:16",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Runway generate failed: ${message}`);
  }

  const data = await response.json();

  if (!data?.id) {
    throw new Error("Runway generate response did not return an id.");
  }

  return data.id as string;
}

export async function getRunwayVideoStatus(taskId: string) {
  const response = await fetch(`${RUNWAY_API_BASE}/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${RUNWAY_API_KEY}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Runway status fetch failed: ${message}`);
  }

  const data = await response.json();
  const status = data?.status;
  const output = data?.output;

  let videoUrl: string | undefined;
  if (typeof output === "string") {
    videoUrl = output;
  } else if (Array.isArray(output) && output.length > 0) {
    videoUrl = typeof output[0] === "string" ? output[0] : undefined;
  } else if (output && typeof output === "object") {
    if (typeof output.url === "string") {
      videoUrl = output.url;
    } else if (typeof output.video_url === "string") {
      videoUrl = output.video_url;
    }
  }

  return {
    status: status === "SUCCEEDED" ? "complete" : status === "FAILED" ? "failed" : "processing",
    videoUrl,
    raw: data,
  } as const;
}
