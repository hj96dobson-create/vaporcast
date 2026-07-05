import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { isDisposableEmail } from "@/lib/disposable-emails";
import {
  findByEmail,
  getConfirmedCount,
  insertPending,
} from "@/lib/waitlist-store.server";
import { sendWaitlistConfirmationEmail } from "@/lib/send-waitlist-email.server";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  source: z.string().trim().max(64).optional(),
});

function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const Route = createFileRoute("/api/waitlist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Please enter a valid email address." },
            { status: 400 },
          );
        }
        const email = parsed.data.email;
        const source = parsed.data.source ?? "homepage modal";

        if (isDisposableEmail(email)) {
          return Response.json(
            { error: "Please use a permanent email address." },
            { status: 400 },
          );
        }

        const existing = await findByEmail(email);
        if (existing) {
          if (existing.status === "rejected") {
            return Response.json(
              { error: "This email cannot be added to the waitlist." },
              { status: 400 },
            );
          }
          return Response.json(
            {
              error: "You are already on the waitlist.",
              alreadyOnList: true,
              status: existing.status,
            },
            { status: 409 },
          );
        }

        const token = randomToken();
        try {
          await insertPending({
            email,
            emailNormalized: email,
            source,
            token,
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          if (/duplicate key|unique constraint/i.test(msg)) {
            return Response.json(
              { error: "You are already on the waitlist." },
              { status: 409 },
            );
          }
          console.error("[waitlist] insert failed:", err);
          return Response.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 },
          );
        }

        const origin = new URL(request.url).origin;
        const confirmUrl = `${origin}/confirm-waitlist?token=${token}`;
        await sendWaitlistConfirmationEmail({
          to: email,
          confirmationUrl: confirmUrl,
          origin,
        });

        const confirmedCount = await getConfirmedCount();
        return Response.json({
          ok: true,
          message:
            "Check your inbox — we sent a confirmation link to secure your spot.",
          confirmedCount,
        });
      },
    },
  },
});
