import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { enquirySchema, type Enquiry } from "@/lib/validation/enquiry";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/* ── Basic abuse protection (per server instance) ─────────────────────────── */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function emailHtml(e: Enquiry) {
  const row = (k: string, v?: string) =>
    v
      ? `<tr><td style="padding:10px 16px 10px 0;color:#8a857d;font:12px/1.4 monospace;text-transform:uppercase;letter-spacing:.12em;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:10px 0;color:#f5f3ef;font:15px/1.5 Arial,sans-serif">${esc(v)}</td></tr>`
      : "";
  return `<!doctype html><html><body style="margin:0;background:#0e0e0e;padding:32px">
  <table role="presentation" width="100%" style="max-width:620px;margin:auto;background:#111;border:1px solid #2a2825">
    <tr><td style="padding:28px 28px 8px;font:12px monospace;letter-spacing:.2em;color:#d7ff3a">NEW ENQUIRY — REELCLICKS.IN</td></tr>
    <tr><td style="padding:0 28px 8px;font:bold 28px Arial,sans-serif;color:#f4f1ea">${esc(e.name)}</td></tr>
    <tr><td style="padding:8px 28px 24px"><table role="presentation">
      ${row("Service", e.service)}
      ${row("Phone", e.phone)}
      ${row("Email", e.email)}
      ${row("Date", e.date)}
      ${row("Location", e.location)}
      ${row("Budget", e.budget || undefined)}
    </table></td></tr>
    <tr><td style="padding:0 28px 28px;color:#d8d4cc;font:15px/1.6 Arial,sans-serif;white-space:pre-wrap">${esc(e.message)}</td></tr>
  </table></body></html>`;
}

function emailText(e: Enquiry) {
  return [
    `New enquiry — ${site.name}`,
    "",
    `Name: ${e.name}`,
    `Service: ${e.service}`,
    `Phone: ${e.phone}`,
    `Email: ${e.email}`,
    e.date ? `Date: ${e.date}` : "",
    `Location: ${e.location}`,
    e.budget ? `Budget: ${e.budget}` : "",
    "",
    e.message,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many enquiries. Please try again later or reach us on WhatsApp." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    // honeypot filled → pretend success so bots learn nothing
    if (parsed.error.issues.some((i) => i.path[0] === "company")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;
  if (data.startedAt && Date.now() - data.startedAt < 3000) {
    return NextResponse.json({ ok: true }); // submitted inhumanly fast → silently drop
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = (process.env.ENQUIRY_TO_EMAIL || site.email).split(",").map((s) => s.trim()).filter(Boolean);

  if (!apiKey || !from) {
    console.error("[enquiry] Email delivery is not configured (RESEND_API_KEY / ENQUIRY_FROM_EMAIL missing).");
    return NextResponse.json(
      {
        ok: false,
        error: "Online enquiries are temporarily unavailable. Please reach us on WhatsApp or by phone — we'd love to hear from you.",
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `New enquiry: ${data.service} — ${data.name}`,
      html: emailHtml(data),
      text: emailText(data),
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[enquiry] Resend error", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your enquiry just now. Please try again, or reach us on WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
