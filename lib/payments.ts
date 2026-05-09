/**
 * Pricing source-of-truth for Stripe Checkout. Re-uses content.ts so prices
 * shown on the marketing site stay in lock-step with what we actually charge.
 *
 * One-off items (workouts, boosters, products, programmes) are passed to
 * Checkout as inline `price_data`. Subscriptions (memberships) cannot use
 * inline pricing — they reference real Stripe Price IDs supplied via env.
 */

import type Stripe from "stripe";
import { BOOSTERS, PRODUCTS, WORKOUTS } from "./content";

/**
 * The Stripe SDK re-exports `SessionCreateParams` as a flat type alias under
 * `Stripe.Checkout`, so nested params like `LineItem` aren't reachable via
 * dot-notation. Derive the line-item shape from the create-method signature.
 */
type CheckoutLineItem = NonNullable<
  NonNullable<Parameters<Stripe["checkout"]["sessions"]["create"]>[0]>["line_items"]
>[number];

export const CURRENCY = "gbp";

export const COURSE = {
  bookValue: "course",
  name: "Sculpt Course",
  price: 440,
  durationLabel: "4 × 40 min",
  description: "Four Sculpt Signature workouts, fortnightly across eight weeks.",
};

export type LineItemSource =
  | { kind: "workout"; bookValue: string }
  | { kind: "booster"; slug: string }
  | { kind: "product"; slug: string };

export function lookupWorkoutOrCourse(value: string) {
  if (value === COURSE.bookValue) return COURSE;
  return WORKOUTS.find((w) => w.bookValue === value) ?? null;
}

export function lookupBooster(slug: string) {
  return BOOSTERS.find((b) => b.slug === slug) ?? null;
}

export function lookupProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/** Build Checkout line items from a workout/course + optional boosters. */
export function bookingLineItems(
  workoutValue: string,
  boosterSlugs: string[],
): CheckoutLineItem[] | null {
  const workout = lookupWorkoutOrCourse(workoutValue);
  if (!workout) return null;

  const items: CheckoutLineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: CURRENCY,
        unit_amount: workout.price * 100,
        product_data: {
          name: `FaceSculpt — ${workout.name}`,
          description: workout.durationLabel,
        },
      },
    },
  ];

  for (const slug of boosterSlugs) {
    const booster = lookupBooster(slug);
    if (!booster) continue;
    items.push({
      quantity: 1,
      price_data: {
        currency: CURRENCY,
        unit_amount: booster.price * 100,
        product_data: {
          name: `Booster — ${booster.name}`,
          description: booster.durationLabel,
        },
      },
    });
  }

  return items;
}

export function productLineItem(
  slug: string,
  quantity = 1,
): CheckoutLineItem | null {
  const product = lookupProduct(slug);
  if (!product) return null;
  return {
    quantity,
    price_data: {
      currency: CURRENCY,
      unit_amount: product.price * 100,
      product_data: {
        name: product.name,
        description: product.meta,
      },
    },
  };
}

export type MembershipTier = "standard" | "plus";

export function membershipPriceId(tier: MembershipTier): string | null {
  return tier === "standard"
    ? process.env.STRIPE_PRICE_MEMBERSHIP_STANDARD ?? null
    : process.env.STRIPE_PRICE_MEMBERSHIP_PLUS ?? null;
}
