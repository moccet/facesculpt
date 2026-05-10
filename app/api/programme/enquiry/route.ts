import { NextRequest } from "next/server";
import { postSlack, ukNow } from "@/lib/slack";
import {
  badRequest, clientInfo, ok, rateLimit, serverError, str, tooMany,
} from "@/lib/api";
import { PROGRAMMES } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight beacon fired from the Programmes grid when someone clicks
 * "Enquire about a Day" or "Enquire about the Year". The mailto link still
 * fires from the click, so the user gets their email client; this just
 * makes sure the studio sees the interest in Slack regardless of whether
 * they actually send the email.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  if (typeof body._hp === "string" && body._hp.length > 0) return ok();

  const info = clientInfo(req);
  if (!rateLimit(`programme-enquiry:${info.ip}`, 6, 60_000)) return tooMany();

  const slug = str(body.slug);
  if (!slug) return badRequest("slug required");
  const programme = PROGRAMMES.find((p) => p.slug === slug);
  if (!programme) return badRequest("Unknown programme");

  const text =
    `🪴 FaceSculpt — programme enquiry started\n` +
    `Programme: ${programme.name} (${programme.price})\n` +
    `Status: User clicked the enquiry CTA — email client opening\n` +
    `IP: ${info.ip}\n` +
    `Time: ${ukNow()}`;

  try {
    await postSlack(text);
    return ok();
  } catch (err) {
    console.error("[programme/enquiry] slack post failed:", err);
    return serverError();
  }
}
