import {
  ABOUT_FAQ,
  BOOSTERS,
  MEMBERSHIP_FAQ,
  PRODUCTS,
  PROGRAMMES,
  TIERS,
  WORKOUTS,
  WORKOUTS_FAQ,
} from "./content";

export type SearchEntry = {
  /** Stable identifier for React keys. */
  id: string;
  /** Bucket label shown next to results. */
  category: "Workout" | "Booster" | "Programme" | "Product" | "Membership" | "FAQ" | "Page";
  title: string;
  /** Short subtitle: price, duration, or first sentence of an FAQ answer. */
  subtitle?: string;
  /** Where to send the user when they pick this result. */
  href: string;
  /** Lower-cased, space-joined tokens used for matching. */
  haystack: string;
};

const PAGES: SearchEntry[] = [
  {
    id: "page:home",
    category: "Page",
    title: "Home",
    subtitle: "FaceSculpt by The Wellness",
    href: "/",
    haystack: "home facesculpt",
  },
  {
    id: "page:workouts",
    category: "Page",
    title: "Workouts",
    subtitle: "Six workouts, four boosters, three programmes",
    href: "/workouts",
    haystack: "workouts boosters programmes",
  },
  {
    id: "page:shop",
    category: "Page",
    title: "Shop",
    subtitle: "Tools, skincare, kits",
    href: "/shop",
    haystack: "shop tools skincare kits products",
  },
  {
    id: "page:membership",
    category: "Page",
    title: "Membership",
    subtitle: "Standard £100/mo · Plus £250/mo",
    href: "/membership",
    haystack: "membership member subscribe standard plus",
  },
  {
    id: "page:about",
    category: "Page",
    title: "About",
    subtitle: "The studio, the team, the founders",
    href: "/about",
    haystack: "about team founders",
  },
  {
    id: "page:assessment",
    category: "Page",
    title: "Take the assessment",
    subtitle: "Eight questions, ninety seconds",
    href: "/assessment",
    haystack: "assessment quiz plan recommendation",
  },
];

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

export const SEARCH_INDEX: SearchEntry[] = (() => {
  const out: SearchEntry[] = [...PAGES];

  for (const w of WORKOUTS) {
    out.push({
      id: `workout:${w.slug}`,
      category: "Workout",
      title: w.name,
      subtitle: `£${w.price} · ${w.durationLabel}`,
      href: `/workouts?w=${w.bookValue}#book`,
      haystack: norm(`${w.name} ${w.meta} ${w.desc} ${w.details.join(" ")}`),
    });
  }

  for (const b of BOOSTERS) {
    out.push({
      id: `booster:${b.slug}`,
      category: "Booster",
      title: b.name,
      subtitle: `£${b.price} · ${b.durationLabel}`,
      href: "/workouts#boosters",
      haystack: norm(`${b.name} ${b.durationLabel} ${b.desc}`),
    });
  }

  for (const p of PROGRAMMES) {
    out.push({
      id: `programme:${p.slug}`,
      category: "Programme",
      title: p.name,
      subtitle: `${p.price} · ${p.eyebrow}`,
      href: p.cta.href,
      haystack: norm(`${p.name} ${p.eyebrow} ${p.detail}`),
    });
  }

  for (const p of PRODUCTS) {
    out.push({
      id: `product:${p.slug}`,
      category: "Product",
      title: p.name,
      subtitle: `£${p.price.toFixed(2)} · ${p.meta}`,
      href: `/shop#${p.slug}`,
      haystack: norm(`${p.name} ${p.meta} ${p.category}`),
    });
  }

  for (const t of TIERS) {
    out.push({
      id: `tier:${t.variant}`,
      category: "Membership",
      title: t.name,
      subtitle: `${t.price}${t.period} · ${t.eyebrow}`,
      href: "/membership#tiers",
      haystack: norm(`${t.name} ${t.eyebrow} ${t.strap} ${t.list.join(" ")}`),
    });
  }

  const faqs: { items: typeof WORKOUTS_FAQ; href: string }[] = [
    { items: WORKOUTS_FAQ, href: "/workouts" },
    { items: MEMBERSHIP_FAQ, href: "/membership" },
    { items: ABOUT_FAQ, href: "/about" },
  ];
  for (const group of faqs) {
    for (const [i, faq] of group.items.entries()) {
      out.push({
        id: `faq:${group.href}:${i}`,
        category: "FAQ",
        title: faq.q,
        subtitle: faq.a.length > 100 ? faq.a.slice(0, 100) + "…" : faq.a,
        href: group.href,
        haystack: norm(`${faq.q} ${faq.a}`),
      });
    }
  }

  return out;
})();

/**
 * Score an entry against a query: matches on whole-string prefix, all-token
 * presence (AND match), or substring fall-through. Returns null when the
 * entry doesn't match. Higher score = better match.
 */
export function scoreEntry(entry: SearchEntry, tokens: string[]): number | null {
  if (tokens.length === 0) return null;
  const title = norm(entry.title);
  let score = 0;
  for (const tok of tokens) {
    if (title.startsWith(tok)) score += 6;
    else if (title.includes(tok)) score += 3;
    else if (entry.haystack.includes(tok)) score += 1;
    else return null; // every token must match somewhere
  }
  // Boost shorter titles when scores tie (more specific match).
  return score - title.length * 0.001;
}

export function search(query: string, limit = 12): SearchEntry[] {
  const tokens = norm(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of SEARCH_INDEX) {
    const score = scoreEntry(entry, tokens);
    if (score !== null) scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}
