import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → refreshes cached content within seconds of publishing.
 * Configure in sanity.io/manage → API → Webhooks:
 *   URL:        https://reelclicks.in/api/revalidate
 *   Trigger on: Create, Update, Delete
 *   Projection: {_type}
 *   Secret:     same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
    }
    const type = body?._type;
    if (type) revalidateTag(type, "max");
    revalidateTag("sanity", "max");
    return NextResponse.json({ ok: true, revalidated: type ?? "sanity", now: Date.now() });
  } catch (err) {
    console.error("[revalidate]", err);
    return NextResponse.json({ ok: false, message: "Error revalidating" }, { status: 500 });
  }
}
