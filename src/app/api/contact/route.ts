import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "../../../lib/rate-limit";

// Cache transporter to avoid recreating on every request
let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return cachedTransporter;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 submissions per hour per IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const { success, remaining } = await rateLimit(`contact:${ip}`, 3, 3600);

    if (!success) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": String(remaining) },
        }
      );
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name is too long (max 100 characters)." },
        { status: 400 }
      );
    }
    if (email.length > 254) {
      return NextResponse.json(
        { error: "Email is too long." },
        { status: 400 }
      );
    }
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long (max 5000 characters)." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const toEmail = process.env.SMTP_TO_EMAIL || "pksharmagh4@gmail.com";

    await getTransporter().sendMail({
      from: `"Portfolio Contact" <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `Portfolio Contact: ${escapeHtml(name)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New message from your portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 80px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <div style="line-height: 1.6; color: #333;">
            ${escapeHtml(message).replace(/\n/g, "<br />")}
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="font-size: 12px; color: #999;">
            Sent from portfolio contact form &bull; IP: ${ip}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    // Reset cached transporter on failure so it reconnects next time
    cachedTransporter = null;
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
