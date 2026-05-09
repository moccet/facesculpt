import { NextRequest } from "next/server";
import { postSlack, ukNow } from "@/lib/slack";
import { badRequest, clientInfo, isEmail, ok, rateLimit, serverError, str, tooMany } from "@/lib/api";

/**
 * Fired the moment the booking form has its first identifying field
 * (typically email) on blur. Goal: capture the lead even if they bail
 * before submitting. Idempotency is handled client-side (sent once per
 * page load), so the server just rate-limits per IP.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  // Honeypot: silent success
  if (typeof body._hp === "string" && body._hp.length > 0) return ok();

  const info = clientInfo(req);
  if (!rateLimit(`booking-started:${info.ip}`, 6, 60_000)) return tooMany();

  const email = str(body.email);
  if (!email || !isEmail(email)) return badRequest("Email required");
  const firstName = str(body.firstName) ?? "";
  const lastName = str(body.lastName) ?? "";
  const phone = str(body.phone) ?? "";
  const workout = str(body.workout) ?? "Not selected yet";

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "(no name yet)";

  const text =
    `🪴 FaceSculpt — booking started\n` +
    `Name: ${fullName}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone || "Not provided"}\n` +
    `Workout: ${workout}\n` +
    `Status: Filling out booking form\n` +
    `IP: ${info.ip}\n` +
    `Time: ${ukNow()}`;

  try {
    await postSlack(text);
    return ok();
  } catch (err) {
    console.error("[booking/started] slack post failed:", err);
    return serverError();
  }
}
