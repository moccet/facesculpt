import { NextRequest, NextResponse } from "next/server";
import {
  badRequest, clientInfo, ok, rateLimit, serverError, tooMany,
} from "@/lib/api";
import { getStripe, siteOrigin, stripeEnabled } from "@/lib/stripe";
import { CURRENCY, lookupProduct, productLineItem } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

void CURRENCY; // pin import so refactors keep currency centralised

type IncomingItem = { slug: unknown; quantity: unknown };

/**
 * Multi-line shop checkout. Takes the cart contents, validates each slug
 * against PRODUCTS, builds Stripe line items, and creates a Checkout Session.
 *
 * The webhook in /api/stripe/webhook handles the post-payment Slack
 * notification — this endpoint stays narrowly focused on creating the
 * session and handing back the URL.
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
  if (!rateLimit(`cart-checkout:${info.ip}`, 10, 60_000)) return tooMany();

  const rawItems = Array.isArray(body.items) ? (body.items as IncomingItem[]) : [];
  if (rawItems.length === 0) return badRequest("Cart is empty");
  if (rawItems.length > 20) return badRequest("Too many cart items");

  // Validate + dedupe by slug, summing quantities. Skip unknown slugs;
  // never trust anything from the client without resolving against PRODUCTS.
  const merged = new Map<string, number>();
  for (const item of rawItems) {
    if (typeof item?.slug !== "string") continue;
    const product = lookupProduct(item.slug);
    if (!product) continue;
    const qty = typeof item.quantity === "number" ? item.quantity : 1;
    const safeQty = Math.max(1, Math.min(10, Math.floor(qty)));
    merged.set(product.slug, (merged.get(product.slug) ?? 0) + safeQty);
  }

  if (merged.size === 0) return badRequest("No valid items");

  const lineItems = [...merged.entries()]
    .map(([slug, qty]) => productLineItem(slug, qty))
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (lineItems.length === 0) return serverError("Could not price cart");

  // Encode item list compactly into metadata. Stripe metadata values are
  // capped at 500 chars per value; cart of ≤20 items × short slugs fits.
  const itemsSummary = [...merged.entries()]
    .map(([slug, qty]) => `${slug}:${qty}`)
    .join(",");

  try {
    const stripe = getStripe();
    const origin = siteOrigin(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      shipping_address_collection: { allowed_countries: ["GB"] },
      phone_number_collection: { enabled: true },
      metadata: {
        flow: "cart",
        items: itemsSummary.slice(0, 500),
        clientIP: info.ip,
      },
    });
    if (!session.url) return serverError("Could not create checkout session");
    return ok({ url: session.url });
  } catch (err) {
    console.error("[cart/checkout] failed:", err);
    return serverError("Could not create checkout session");
  }
}
