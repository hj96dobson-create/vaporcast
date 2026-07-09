// This route file should not define server logic directly.
// API behavior has been moved to src/server/api/waitlist.ts.

// The file remains in src/routes/api only if `@tanstack/react-router` requires
// the file-based route to register /api/waitlist, otherwise you can remove it.

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/waitlist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleWaitlistPost } = await import("@/server/api/waitlist");
        return handleWaitlistPost({ request });
      },
    },
  },
});
