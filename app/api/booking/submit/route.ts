import { NextRequest } from "next/server";
import { postSlack, ukNow } from "@/lib/slack";
import { badRequest, clientInfo, isEmail, ok, rateLimit, serverError, str, tooMany } from "@/lib/api";
import { BOOSTERS } from "@/lib/content";
import { bookingLineItems, lookupWorkoutOrCourse } from "@/lib/payments";
import { getStripe, siteOrigin, stripeEnabled } from "@/lib/stripe";

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
  if (!rateLimit(`booking-submit:${info.ip}`, 4, 60_000)) return tooMany();

  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const email = str(body.email);
  const phone = str(body.phone);
  const workoutValue = str(body.workout);
  const date = str(body.date) ?? "";
  const time = str(body.time) ?? "";
  const allergies = str(body.allergies, 2000) ?? "";
  const notes = str(body.notes, 2000) ?? "";

  if (!firstName || !lastName) return badRequest("Name required");
  if (!email || !isEmail(email)) return badRequest("Valid email required");
  if (!phone) return badRequest("Phone required");
  if (!workoutValue) return badRequest("Workout required");

  const workout = lookupWorkoutOrCourse(workoutValue);
  if (!workout) return badRequest("Unknown workout");

  const boosterValues = Array.isArray(body.boosters)
    ? (body.boosters.filter((v): v is string => typeof v === "string"))
    : [];
  const boosters = BOOSTERS.filter((b) => boosterValues.includes(b.slug));
  const total = workout.price + boosters.reduce((s, b) => s + b.price, 0);

  // First-stage Slack: booking submitted, awaiting payment.
  const fields = [
    { type: "mrkdwn", text: `*Workout*\n${workout.name} · ${workout.durationLabel}` },
    { type: "mrkdwn", text: `*Total*\n£${total}` },
    { type: "mrkdwn", text: `*Date*\n${date || "—"}` },
    { type: "mrkdwn", text: `*Time*\n${time || "—"}` },
    { type: "mrkdwn", text: `*Name*\n${firstName} ${lastName}` },
    { type: "mrkdwn", text: `*Email*\n${email}` },
    { type: "mrkdwn", text: `*Phone*\n${phone}` },
    { type: "mrkdwn", text: `*Boosters*\n${boosters.length ? boosters.map((b) => b.name).join(", ") : "—"}` },
  ];

  const blocks: unknown[] = [
    { type: "header", text: { type: "plain_text", text: "✨ FaceSculpt — booking submitted (awaiting payment)" } },
    { type: "section", fields },
  ];

  if (allergies) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Allergies / contraindications*\n${allergies}` },
    });
  }
  if (notes) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Notes*\n${notes}` },
    });
  }
  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: `IP: ${info.ip} · ${ukNow()}` }],
  });

  const fallback = `New FaceSculpt booking — ${firstName} ${lastName} · ${workout.name} · £${total}`;

  try {
    await postSlack(fallback, blocks);
  } catch (err) {
    console.error("[booking/submit] slack post failed:", err);
    return serverError();
  }

  // Second stage: create Stripe Checkout Session and hand the URL back to
  // the client to redirect. If Stripe isn't configured we still return ok so
  // the legacy "request without payment" flow keeps working in dev.
  if (!stripeEnabled()) {
    return ok({ total, paymentRequired: false });
  }

  const lineItems = bookingLineItems(workoutValue, boosterValues);
  if (!lineItems) return serverError("Could not price booking");

  try {
    const stripe = getStripe();
    const origin = siteOrigin(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        flow: "booking",
        workout: workoutValue,
        boosters: boosterValues.join(","),
        firstName,
        lastName,
        phone,
        appointmentDate: date,
        appointmentTime: time,
        allergies: allergies.slice(0, 500),
        notes: notes.slice(0, 500),
        clientIP: info.ip,
      },
      payment_intent_data: {
        description: `FaceSculpt booking — ${firstName} ${lastName}`,
      },
    });

    if (!session.url) return serverError("Could not create checkout session");
    return ok({ total, paymentRequired: true, checkoutUrl: session.url });
  } catch (err) {
    console.error("[booking/submit] stripe session create failed:", err);
    return serverError("Could not create checkout session");
  }
}
