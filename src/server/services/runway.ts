export async function generateRunwayVideo(prompt: string) {
  console.log("[mock-runway] Video request received:", prompt);

  // Creates a fake task ID so the rest of Vaporcast continues working
  return crypto.randomUUID();
}

export async function getRunwayVideoStatus(taskId: string) {
  console.log("[mock-runway] Checking fake task:", taskId);

  // Pretend the job is still processing.
  // The worker expects complete/failed to be possible too.
  return {
    status: "processing" as const,
    videoUrl: undefined,
    raw: {
      id: taskId,
      message: "Mock video generator active. Runway not connected yet.",
    },
  };
}
