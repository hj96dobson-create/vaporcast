import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/avatar/session/start")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { startAvatarLiveSession } = await import("@/server/api/avatar");
        return startAvatarLiveSession({ request });
      },
    },
  },
});
