import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/avatar/session/speak")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { speakAvatarLiveSession } = await import("@/server/api/avatar");
        return speakAvatarLiveSession({ request });
      },
    },
  },
});
