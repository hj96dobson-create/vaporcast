import { createFileRoute, redirect } from "@tanstack/react-router";
import { confirmByToken } from "@/lib/waitlist-store.server";

export const Route = createFileRoute("/api/waitlist/confirm")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        if (!token) {
          throw redirect({ to: "/confirm-waitlist", search: { status: "invalid" } });
        }
        try {
          const row = await confirmByToken(token);
          if (!row) {
            return Response.json({ status: "invalid" }, { status: 400 });
          }
          return Response.json({
            status: "confirmed",
            isFoundingVip: row.is_founding_vip,
            discountTier: row.discount_tier,
          });
        } catch (err) {
          console.error("[waitlist/confirm] failed:", err);
          return Response.json({ status: "error" }, { status: 500 });
        }
      },
    },
  },
});
