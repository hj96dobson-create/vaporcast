import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/waitlist/tier")({
  server: {
    handlers: {
      GET: async () => {
        const { handleWaitlistTier } = await import("@/server/api/waitlist");
        return handleWaitlistTier();
      },
    },
  },
});
