import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/waitlist/confirm")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { handleWaitlistConfirm } = await import("@/server/api/waitlist");
        return handleWaitlistConfirm({ request });
      },
    },
  },
});
