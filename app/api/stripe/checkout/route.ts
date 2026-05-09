import { NextRequest, NextResponse } from "next/server";
import {
  badRequest, clientInfo, isEmail, rateLimit, serverError, str, tooMany,
} from "@/lib/api";
import { getStripe, siteOrigin, stripeEnabled } from "@/lib/stripe";
import {
  bookingLineItems,
  membershipPriceId,
  productLineItem,
  type MembershipTier,
} from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Create a Stripe Checkout Session for one of three flows:
 *   - mode = "booking"   → workout (or course) + optional boosters, one-off
 *   - mode = "product"   → single shop product, one-off
 *   - mode = "membership"→ recurring subscription (Standard or Plus)
 *
 * Booking pre-notification to Slack is handled in /api/booking/submit; this
 * endpoint is purely about creating the Stripe session and returning its URL.
 * Post-payment Slack messages are fired by the webhook handler.
 */
export async function POST(req: NextRequest) {
  if (!stripeEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Payments not configured" },
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
  if (!rateLimit(`stripe-checkout:${info.ip}`, 10, 60_000)) return tooMany();

  const mode = str(body.mode);
  if (!mode) return badRequest("mode required");

  const origin = siteOrigin(req);
  const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/checkout/cancel`;

  const stripe = getStripe();

  try {
    if (mode === "booking") {
      const workoutValue = str(body.workout);
      if (!workoutValue) return badRequest("Workout required");
      const boosters = Array.isArray(body.boosters)
        ? (body.boosters.filter((v): v is string => typeof v === "string"))
        : [];
      const lineItems = bookingLineItems(workoutValue, boosters);
      if (!lineItems) return badRequest("Unknown workout");

      const email = str(body.email);
      const firstName = str(body.firstName) ?? "";
      const lastName = str(body.lastName) ?? "";
      const phone = str(body.phone) ?? "";
      const date = str(body.date) ?? "";
      const time = str(body.time) ?? "";
      if (!email || !isEmail(email)) return badRequest("Email required");

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        customer_email: email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          flow: "booking",
          workout: workoutValue,
          boosters: boosters.join(","),
          firstName,
          lastName,
          phone,
          appointmentDate: date,
          appointmentTime: time,
          clientIP: info.ip,
        },
        payment_intent_data: {
          description: `FaceSculpt booking — ${firstName} ${lastName}`.trim(),
        },
      });

      return NextResponse.json({ ok: true, url: session.url });
    }

    if (mode === "product") {
      const slug = str(body.slug);
      const qtyRaw = body.quantity;
      const quantity = typeof qtyRaw === "number" && qtyRaw > 0 && qtyRaw <= 10
        ? Math.floor(qtyRaw)
        : 1;
      if (!slug) return badRequest("slug required");
      const lineItem = productLineItem(slug, quantity);
      if (!lineItem) return badRequest("Unknown product");

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [lineItem],
        success_url: successUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: { allowed_countries: ["GB"] },
        phone_number_collection: { enabled: true },
        metadata: {
          flow: "product",
          slug,
          quantity: String(quantity),
          clientIP: info.ip,
        },
      });

      return NextResponse.json({ ok: true, url: session.url });
    }

    if (mode === "membership") {
      const tierRaw = str(body.tier);
      if (tierRaw !== "standard" && tierRaw !== "plus") {
        return badRequest("tier must be standard or plus");
      }
      const tier = tierRaw as MembershipTier;
      const priceId = membershipPriceId(tier);
      if (!priceId) {
        return NextResponse.json(
          { ok: false, error: "Membership price ID not configured" },
          { status: 501 },
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        metadata: { flow: "membership", tier, clientIP: info.ip },
        subscription_data: {
          metadata: { flow: "membership", tier },
        },
      });

      return NextResponse.json({ ok: true, url: session.url });
    }

    return badRequest("Unknown mode");
  } catch (err) {
    console.error("[stripe/checkout] failed:", err);
    return serverError("Could not create checkout session");
  }
}
