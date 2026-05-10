import { NextRequest, NextResponse } from "next/server";
import {
  badRequest, clientInfo, isEmail, ok, rateLimit, serverError, str, tooMany,
} from "@/lib/api";
import { getStripe, siteOrigin, stripeEnabled } from "@/lib/stripe";
import { postSlack, ukNow } from "@/lib/slack";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Create a Stripe Customer Portal session for the customer matching the
 * supplied email. Industry-standard for this is magic-link auth — without
 * an email provider wired up we settle for: lookup by email, hand the URL
 * back, and Slack-notify the studio so they can spot abuse.
 *
 * To upgrade to magic-link, add an email provider (Resend / Postmark /
 * SendGrid), generate a short-lived signed token here, and email the
 * portal-fetch URL instead of returning it inline.
 */
export async function POST(req: NextRequest) {
  if (!stripeEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Account portal not configured" },
      { status: 501 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const info = clientInfo(req);
  if (!rateLimit(`portal:${info.ip}`, 4, 60_000)) return tooMany();

  const email = str(body.email);
  if (!email || !isEmail(email)) return badRequest("Valid email required");

  const stripe = getStripe();

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      // Slack the team so they can chase up — maybe the user signed up
      // with a different email or hasn't subscribed yet.
      await postSlack(
        `🔍 FaceSculpt — account portal request, no Stripe customer for ${email}\nIP: ${info.ip} · ${ukNow()}`,
      ).catch(() => {});
      return ok({
        found: false,
        message:
          "We couldn't find a membership tied to that email. Become a member or call the studio if this is a mistake.",
      });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${siteOrigin(req)}/membership`,
    });

    await postSlack(
      `🔐 FaceSculpt — portal session opened for ${email}\nCustomer: ${customer.id} · IP: ${info.ip} · ${ukNow()}`,
    ).catch(() => {});

    return ok({ found: true, url: portal.url });
  } catch (err) {
    console.error("[stripe/portal] failed:", err);
    return serverError("Could not open the portal");
  }
}
