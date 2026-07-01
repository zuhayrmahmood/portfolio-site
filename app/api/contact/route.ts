import { validateContact } from "@/lib/contact";

/**
 * POST /api/contact — validates a contact submission and emails it via Resend.
 *
 * Resend is called over its REST API with `fetch` (no SDK dependency). Sending
 * requires `RESEND_API_KEY`; if it's absent the handler fails loudly-but-kindly
 * so the form tells the visitor to email directly instead of silently dropping.
 *
 * Env:
 *   RESEND_API_KEY     — required to send (create at resend.com/api-keys)
 *   CONTACT_TO_EMAIL   — where submissions are delivered
 *   CONTACT_FROM_EMAIL — verified "from" address (see .env.example)
 */

const DEFAULT_TO = "zuhayrmahmood01@gmail.com";
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request): Promise<Response> {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill the "company" field. If it's filled,
  // it's a bot — pretend everything went fine and send nothing.
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Please check the highlighted fields.", fieldErrors: errors },
      { status: 422 },
    );
  }

  const name = String(data.name).trim();
  const email = String(data.email).trim();
  const message = String(data.message).trim();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY is not set — cannot send email. See .env.example.",
    );
    return Response.json(
      {
        error:
          "The contact form isn't set up yet — please reach me via the links below.",
      },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? DEFAULT_TO;
  const from = process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(
          email,
        )}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend responded", res.status, detail);
      return Response.json(
        { error: "Something went wrong sending your message. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
