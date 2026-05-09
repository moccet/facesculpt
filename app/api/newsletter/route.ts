import { NextRequest } from "next/server";
import { postSlack, ukNow } from "@/lib/slack";
import { badRequest, clientInfo, isEmail, ok, rateLimit, serverError, str, tooMany } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  if (typeof body._hp === "string" && body._hp.length > 0) return ok();

  const info = clientInfo(req);
  if (!rateLimit(`newsletter:${info.ip}`, 3, 60_000)) return tooMany();

  const email = str(body.email);
  if (!email || !isEmail(email)) return badRequest("Valid email required");
  const source = str(body.source) ?? "footer";

  const text =
    `📧 FaceSculpt — newsletter signup\n` +
    `Email: ${email}\n` +
    `Source: ${source}\n` +
    `IP: ${info.ip}\n` +
    `Time: ${ukNow()}`;

  try {
    await postSlack(text);
    return ok();
  } catch (err) {
    console.error("[newsletter] slack post failed:", err);
    return serverError();
  }
}
