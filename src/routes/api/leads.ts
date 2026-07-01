import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { addLead, listLeads } from "@/lib/leads-store.server";

const leadSchema = z.object({
  email: z.string().trim().email().max(255),
  source: z.string().trim().max(64).optional(),
});

function toCsv(rows: { id: string; email: string; source: string; createdAt: string }[]) {
  const header = ["id", "email", "source", "createdAt"];
  const escape = (v: string) =>
    /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([r.id, r.email, r.source, r.createdAt].map(escape).join(","));
  }
  return lines.join("\n");
}

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

        const lead = addLead({
          email: parsed.data.email,
          source: parsed.data.source ?? "cta",
        });
        console.log("[lead]", lead);
        return Response.json({ ok: true });
      },
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q") ?? undefined;
        const source = url.searchParams.get("source") ?? undefined;
        const since = url.searchParams.get("since") ?? undefined;
        const format = url.searchParams.get("format");
        const limit = Number(url.searchParams.get("limit")) || undefined;

        const rows = listLeads({ q, source, since, limit });

        if (format === "csv") {
          return new Response(toCsv(rows), {
            status: 200,
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition": `attachment; filename="leads-${new Date()
                .toISOString()
                .slice(0, 10)}.csv"`,
            },
          });
        }

        return Response.json({ leads: rows, count: rows.length });
      },
    },
  },
});
