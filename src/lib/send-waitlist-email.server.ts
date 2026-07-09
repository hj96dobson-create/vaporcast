// Sends the waitlist confirmation email. If the Lovable email infrastructure
// is not yet configured for this project, falls back to logging the
// confirmation URL server-side so the flow can still be tested.

export async function sendWaitlistConfirmationEmail(input: {
  to: string;
  confirmationUrl: string;
  origin: string;
}) {
  const { to, confirmationUrl, origin } = input;

  const subject = "Confirm your Vaporcast Early Access";
  const bodyText = [
    "Welcome to Vaporcast.",
    "",
    "Please confirm your email to secure your spot on the early-access waitlist:",
    confirmationUrl,
    "",
    "The first 10 confirmed members become Founding VIPs with 50% off any plan for 6 months after launch.",
    "",
    "If you didn't request this, you can safely ignore this email.",
  ].join("\n");

  const bodyHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#0f172a;">
      <h1 style="font-size:22px;margin:0 0 16px;">Confirm your Vaporcast early access</h1>
      <p style="line-height:1.6;color:#334155;">Please confirm your email to secure your spot on the waitlist.</p>
      <p style="margin:24px 0;">
        <a href="${confirmationUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:9999px;font-weight:600;">Confirm my email</a>
      </p>
      <p style="font-size:13px;color:#64748b;line-height:1.6;">Or copy this link:<br /><a href="${confirmationUrl}">${confirmationUrl}</a></p>
      <p style="font-size:13px;color:#64748b;line-height:1.6;margin-top:24px;">The first 10 confirmed members become <strong>Founding VIPs</strong> with 50% off any plan for 6 months after launch.</p>
    </div>
  `;

  // Try the Lovable Emails transactional queue.
  try {
    const res = await fetch(`${origin}/lovable/email/transactional/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LOVABLE_API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        recipientEmail: to,
        subject,
        html: bodyHtml,
        text: bodyText,
        idempotencyKey: `waitlist-confirm-${to}`,
      }),
    });
    if (res.ok) return { ok: true, delivery: "queued" as const };
    const text = await res.text().catch(() => "");
    console.warn("[waitlist-email] send route unavailable:", res.status, text);
  } catch (err) {
    console.warn("[waitlist-email] send route error:", err);
  }

  // Fallback: log the confirmation URL so it can be delivered manually until
  // the email domain / infrastructure is finished setting up.
  console.log(`[waitlist-email:FALLBACK] to=${to} confirm_url=${confirmationUrl}`);
  return { ok: true, delivery: "logged" as const };
}
