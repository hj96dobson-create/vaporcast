import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/avatar/provider/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getAvatarProviderReadiness } = await import("@/server/api/avatar");
        return getAvatarProviderReadiness({ request });
      },
    },
  },
});
