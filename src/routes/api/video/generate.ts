import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/video/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { createVideoJob } = await import("@/server/api/video");
        return createVideoJob({ request });
      },
    },
  },
});
