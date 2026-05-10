export type Workout = {
  slug: string;
  name: string;
  price: number;
  durationLabel: string;
  meta: string;
  desc: string;
  details: string[];
  flag?: string;
  bookValue: string;
  image?: string;
};

export type Booster = {
  slug: string;
  name: string;
  price: number;
  durationLabel: string;
  desc: string;
  image?: string;
};

export type Programme = {
  slug: string;
  eyebrow: string;
  name: string;
  price: string;
  detail: string;
  list: string[];
  cta: { label: string; href: string };
  recommended?: boolean;
  flag?: string;
};

export type Product = {
  slug: string;
  category: "tools" | "skincare" | "kits";
  name: string;
  meta: string;
  price: number;
  memberPrice: number;
  flag?: string;
  image?: string;
};

export type FAQ = { q: string; a: string };

export type Tier = {
  variant: "standard" | "plus";
  flag?: string;
  eyebrow: string;
  name: string;
  price: string;
  period: string;
  strap: string;
  list: string[];
  ctaLabel: string;
  ctaHref: string;
};
