import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { postSlack, ukNow } from "@/lib/slack";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook entry. We rely on Stripe's signed events (verified with the
 * raw body — note `request.text()`, not `.json()`) to fire the second-stage
 * Slack notifications:
 *   - checkout.session.completed       → "💳 booking paid" / "🛒 order placed"
 *   - customer.subscription.created    → "🌿 new member"
 *   - customer.subscription.deleted    → "👋 member cancelled"
 *   - payment_intent.payment_failed    → "❌ payment failed"
 *
 * The first-stage "booking submitted" Slack message is fired by
 * /api/booking/submit at form-submit time so leads aren't lost if the user
 * bails on the Checkout page.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error(
      "[stripe/webhook] signature verification failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await onCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        await onSubscriptionCreated(sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await onSubscriptionDeleted(sub);
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await onPaymentFailed(pi);
        break;
      }
      default:
        // Most events are ignored. Log to keep diagnostics easy in Stripe dashboard.
        console.log(`[stripe/webhook] unhandled event ${event.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(
      "[stripe/webhook] handler threw:",
      err instanceof Error ? err.message : err,
    );
    // Return 200 anyway — Stripe will retry on 5xx and the Slack hop is
    // best-effort; we don't want stuck webhook events because of a Slack hiccup.
    return NextResponse.json({ received: true, warning: "handler error logged" });
  }
}

function fmtAmount(amount: number | null, currency: string | null): string {
  if (amount == null) return "—";
  const sym = currency === "gbp" ? "£" : currency === "eur" ? "€" : currency === "usd" ? "$" : "";
  return `${sym}${(amount / 100).toFixed(2)}`;
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  const flow = session.metadata?.flow ?? "(unknown)";
  const customerName = session.customer_details?.name ?? "—";
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? "—";
  const customerPhone = session.customer_details?.phone ?? "—";
  const amount = fmtAmount(session.amount_total, session.currency);

  if (flow === "booking") {
    const m = session.metadata ?? {};
    const blocks = [
      { type: "header", text: { type: "plain_text", text: "💳 FaceSculpt — booking paid" } },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Workout*\n${m.workout ?? "—"}` },
          { type: "mrkdwn", text: `*Total*\n${amount}` },
          { type: "mrkdwn", text: `*Date*\n${m.appointmentDate || "—"}` },
          { type: "mrkdwn", text: `*Time*\n${m.appointmentTime || "—"}` },
          { type: "mrkdwn", text: `*Name*\n${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || "—" },
          { type: "mrkdwn", text: `*Email*\n${customerEmail}` },
          { type: "mrkdwn", text: `*Phone*\n${m.phone || customerPhone}` },
          { type: "mrkdwn", text: `*Boosters*\n${m.boosters || "—"}` },
        ],
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `Session: ${session.id} · ${ukNow()}` },
        ],
      },
    ];
    await postSlack(
      `FaceSculpt booking paid — ${customerName} · ${amount}`,
      blocks,
    );
    return;
  }

  if (flow === "product") {
    const m = session.metadata ?? {};
    // shipping_details is on the API response but isn't in the typed Session
    // returned by the Stripe SDK, so we read it through a narrow cast.
    const ship = (session as unknown as {
      shipping_details?: { address?: Stripe.Address | null } | null;
    }).shipping_details?.address;
    const blocks = [
      { type: "header", text: { type: "plain_text", text: "🛒 FaceSculpt — shop order" } },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Product*\n${m.slug ?? "—"} × ${m.quantity ?? 1}` },
          { type: "mrkdwn", text: `*Total*\n${amount}` },
          { type: "mrkdwn", text: `*Name*\n${customerName}` },
          { type: "mrkdwn", text: `*Email*\n${customerEmail}` },
          { type: "mrkdwn", text: `*Phone*\n${customerPhone}` },
          {
            type: "mrkdwn",
            text: `*Ship to*\n${
              ship
                ? [ship.line1, ship.line2, ship.city, ship.postal_code, ship.country]
                    .filter(Boolean)
                    .join(", ")
                : "—"
            }`,
          },
        ],
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: `Session: ${session.id} · ${ukNow()}` }],
      },
    ];
    await postSlack(`FaceSculpt order — ${customerName} · ${amount}`, blocks);
    return;
  }

  if (flow === "membership") {
    // Subscription-mode sessions also fire customer.subscription.created;
    // we let that be the primary signal and skip duplicating here.
    return;
  }

  // Fallback for any other flow we add later.
  await postSlack(
    `FaceSculpt checkout completed — ${flow} · ${customerName} · ${amount}`,
  );
}

async function onSubscriptionCreated(sub: Stripe.Subscription) {
  const tier = sub.metadata?.tier ?? "(unknown tier)";
  const stripe = getStripe();

  let email = "—";
  try {
    const customer = await stripe.customers.retrieve(sub.customer as string);
    if (!("deleted" in customer) || !customer.deleted) {
      email = (customer as Stripe.Customer).email ?? "—";
    }
  } catch (err) {
    console.error("[stripe/webhook] customer fetch failed:", err);
  }

  const item = sub.items.data[0];
  const amount = item?.price.unit_amount;
  const interval = item?.price.recurring?.interval ?? "month";
  const amountStr = fmtAmount(amount ?? null, sub.currency);

  const blocks = [
    { type: "header", text: { type: "plain_text", text: "🌿 FaceSculpt — new member" } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Tier*\n${tier}` },
        { type: "mrkdwn", text: `*Rate*\n${amountStr} / ${interval}` },
        { type: "mrkdwn", text: `*Email*\n${email}` },
        { type: "mrkdwn", text: `*Status*\n${sub.status}` },
      ],
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: `Subscription: ${sub.id} · ${ukNow()}` }],
    },
  ];
  await postSlack(`FaceSculpt — new ${tier} member (${email})`, blocks);
}

async function onSubscriptionDeleted(sub: Stripe.Subscription) {
  const tier = sub.metadata?.tier ?? "(unknown tier)";
  await postSlack(
    `👋 FaceSculpt — membership cancelled (${tier})\nSub: ${sub.id} · ${ukNow()}`,
  );
}

async function onPaymentFailed(pi: Stripe.PaymentIntent) {
  const amount = fmtAmount(pi.amount ?? null, pi.currency);
  const reason = pi.last_payment_error?.message ?? "Unknown reason";
  const flow = pi.metadata?.flow ?? "(unknown)";
  await postSlack(
    `❌ FaceSculpt — payment failed (${flow}) · ${amount}\nReason: ${reason}\nPI: ${pi.id} · ${ukNow()}`,
  );
}
