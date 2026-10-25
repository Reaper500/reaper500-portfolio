import { NextResponse } from "next/server";

/**
 * Contact form handler.
 *
 * Validates input server-side. If the optional Resend environment variables are
 * set, it delivers the message by email; otherwise it returns a clear
 * `configured: false` response so the UI can explain that setup is required and
 * point the visitor to GitHub instead. It never pretends a message was sent
 * when it wasn't.
 */

interface ContactBody {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (subject.length < 3) errors.subject = "Please add a short subject.";
  if (message.length < 10) errors.message = "Please write at least 10 characters.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error:
          "Email delivery isn't configured on this deployment yet. Set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL on the server to enable it — in the meantime, reach out through GitHub.",
      },
      { status: 503 },
    );
  }

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
        subject: `[Portfolio] ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          error:
            "The email service rejected the message. Please try again, or use the GitHub link.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        error:
          "Could not reach the email service. Please try again, or use the GitHub link.",
      },
      { status: 502 },
    );
  }
}
