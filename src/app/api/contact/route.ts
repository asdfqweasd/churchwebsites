import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail =
  process.env.CONTACT_FROM_EMAIL || "no-reply@sydneywestworshipcentre.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

type ContactPayload = {
  fullName?: string;
  email?: string;
  message?: string;
};

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!fullName || !email || !message) {
    return NextResponse.json(
      { error: "Please provide name, email, and message." },
      { status: 400 }
    );
  }

  if (!resend || !resendApiKey) {
    return NextResponse.json(
      { error: "Email service not configured (missing RESEND_API_KEY)." },
      { status: 500 }
    );
  }

  if (!contactToEmail) {
    return NextResponse.json(
      { error: "Missing CONTACT_TO_EMAIL environment variable." },
      { status: 500 }
    );
  }

  try {
    await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: email,
      subject: `New contact from ${fullName}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
