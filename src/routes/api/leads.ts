import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const leadSchema = z.object({
  email: z.string().trim().email().max(255),
  source: z.string().trim().max(64).optional(),
});

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = leadSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Please enter a valid email address." },
            { status: 400 },
          );
        }

        // Log the lead — swap for DB / CRM / email provider later.
        console.log("[lead]", {
          email: parsed.data.email,
          source: parsed.data.source ?? "cta",
          at: new Date().toISOString(),
        });

        return Response.json({ ok: true });
      },
    },
  },
});
