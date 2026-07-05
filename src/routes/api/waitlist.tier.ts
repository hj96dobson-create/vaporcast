import { createFileRoute } from "@tanstack/react-router";
import { getConfirmedCount } from "@/lib/waitlist-store.server";

export const Route = createFileRoute("/api/waitlist/tier")({
  server: {
    handlers: {
      GET: async () => {
        const confirmedCount = await getConfirmedCount();
        const vipCap = 10;
        const tier = confirmedCount < vipCap ? "vip" : "standard";
        return Response.json({
          confirmedCount,
          vipCap,
          tier,
          vipSpotsLeft: Math.max(0, vipCap - confirmedCount),
        });
      },
    },
  },
});
