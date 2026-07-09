const RUNWAY_API_KEY = import.meta.env.VITE_RUNWAY_API_KEY;

export async function generateRunwayVideo(prompt: string) {
  const res = await fetch("https://api.runwayml.com/v1/image_to_video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RUNWAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model: "gen3a_turbo",
      ratio: "9:16",
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

export async function pollRunwayTask(taskId: string) {
  while (true) {
    const res = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${RUNWAY_API_KEY}`,
      },
    });

    const data = await res.json();

    if (data.status === "SUCCEEDED") return data.output;
    if (data.status === "FAILED") throw new Error("Runway failed");

    await new Promise((r) => setTimeout(r, 3000));
  }
}
