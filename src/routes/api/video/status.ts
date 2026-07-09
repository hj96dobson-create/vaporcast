import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/video/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getVideoJobStatus } = await import("@/server/api/video");
        return getVideoJobStatus({ request });
      },
    },
  },
});
