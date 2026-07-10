import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/avatar/session/end")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { endAvatarLiveSession } = await import("@/server/api/avatar");
        return endAvatarLiveSession({ request });
      },
    },
  },
});
