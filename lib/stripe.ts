import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Lazy server-side Stripe client. Lazy so importing this module doesn't
 * crash builds when STRIPE_SECRET_KEY is unset (e.g. on Vercel preview
 * deploys without env wired up). Routes that actually call it must be
 * runtime = "nodejs" + dynamic = "force-dynamic".
 */
export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  cached = new Stripe(key);
  return cached;
}

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Origin to use for Checkout success/cancel URLs. */
export function siteOrigin(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
